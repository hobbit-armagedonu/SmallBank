const supertest = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const { app, server } = require('../../bank');
const { SessionCache } = require('../../lib/sessionDriver');
const individualService = require('../../lib/individuals/individualsService');

describe('individuals (controller)', () => {
    let admin;
    let ordinaryUser;
    let dolly;

    after(() => {
        server.close();
    });

    beforeEach(() => {
        admin = {
            individualId: 'fakeId',
            permissions: ['ADMIN'],
        };
        ordinaryUser = {
            individualId: 'fakeId',
            permissions: ['USER'],
        };
        dolly = {
            id: '424cd60f-f494-410f-ac99-f939ce687f14',
            first_name: 'Dolly',
            last_name: 'Parton',
            date_of_birth: '1962-01-04',
            email: 'dolly.parton@yahoo.com',
            country_code: 'US',
            phone_number: '+1707653356',
            street1: 'Country drive 69',
            street2: 'door 3',
            city: 'Austin',
            region: 'Texas',
            postal_code: 'XXXXXX',
            status: 'pending_activation',
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('POST /individuals', () => {
        it('should return 403 when no auth', async () => {
            const response = await supertest(app)
                .post('/individuals')
                .expect(403);
            expect(response.body.error).to.be.equal('No authorization header');
        });
        it('should return 403 when wrong auth type', async () => {
            const response = await supertest(app)
                .post('/individuals')
                .set('Authorization', 'Basic xxxx')
                .expect(403);
            expect(response.body.error).to.be.equal('Unsupported authorization header');
        });
        it('should return 403 when no token', async () => {
            const response = await supertest(app)
                .post('/individuals')
                .set('Authorization', 'Bearer')
                .expect(403);
            expect(response.body.error).to.be.equal('Invalid token');
        });
        it('should return 403 for unknown token', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves();
            const response = await supertest(app)
                .post('/individuals')
                .set('Authorization', 'Bearer quite_invalid_token')
                .expect(403);
            expect(response.body.error).to.be.equal('Invalid token');
        });
        it('should return 403 when performed by user without a right to create individuals', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(ordinaryUser);
            const response = await supertest(app)
                .post('/individuals')
                .set('Authorization', 'Bearer function_stubbed')
                .expect(403);
            expect(response.body.error).to.be.equal('No rights to create individuals');
        });
        it('should return 400 when ADMIN creates incomplete individual', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(admin);
            delete dolly.date_of_birth;
            const response = await supertest(app)
                .post('/individuals')
                .set('Authorization', 'Bearer function_stubbed')
                .send(dolly)
                .expect(400);
            expect(response.body.errors[0].message).to.be.equal('Body parameter: date_of_birth not provided.');
        });
        it('should return 200 when ADMIN creates proper individual', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(admin);
            const createStub = sinon.stub(individualService, 'createIndividual').resolves({ id: 'fake' });
            const response = await supertest(app)
                .post('/individuals')
                .set('Authorization', 'Bearer function_stubbed')
                .send(dolly)
                .expect(200);
            expect(response.body.id).to.be.equal('fake');
            expect(createStub.callCount).to.be.equal(1);
        });
    });
    describe('GET /individuals', () => {
        it('should return single individual for a non-ADMIN/SUPPORT user', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(ordinaryUser);
            const serviceStub = sinon.stub(individualService, 'getIndividual').resolves([dolly]);
            const response = await supertest(app)
                .get('/individuals')
                .set('Authorization', 'Bearer function_stubbed')
                .expect(200);
            expect(response.body.data).to.eql([dolly]);
            expect(serviceStub.callCount).to.be.equal(1);
        });
        it('should return multiple individuals for an ADMIN', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(admin);
            const serviceStub = sinon.stub(individualService, 'getManyIndividuals').resolves([dolly, dolly]);
            const response = await supertest(app)
                .get('/individuals')
                .set('Authorization', 'Bearer function_stubbed')
                .expect(200);
            expect(response.body.data.length).to.eql(2);
            expect(serviceStub.callCount).to.be.equal(1);
        });
        it('should use limit, sort, start and end params', async () => {
            const params = {
                limit: 10,
                sort_type: 'ASC',
                starting_after: '123',
                ending_before: '987',
            };
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(admin);
            const serviceStub = sinon.stub(individualService, 'getManyIndividuals').resolves([dolly, dolly]);
            await supertest(app)
                .get('/individuals')
                .set('Authorization', 'Bearer function_stubbed')
                .send(params)
                .expect(200);
            const serviceCallArgs = serviceStub.firstCall.args;
            expect(serviceCallArgs[0]).to.be.equal(10);
            expect(serviceCallArgs[1]).to.be.equal('ASC');
            expect(serviceCallArgs[2]).to.be.equal('123');
            expect(serviceCallArgs[3]).to.be.equal('987');
        });
        it('should return meaningful has_more');
    });
    describe('GET /individuals/:id', () => {
        it('returns 403 for non-admin user that tries to view other individual', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(ordinaryUser);
            await supertest(app)
                .get('/individuals/notMyId')
                .set('Authorization', 'Bearer function_stubbed')
                .expect(403);
        });
        it('returns 404 when individual not found', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(admin);
            sinon.stub(individualService, 'getIndividual').resolves();
            await supertest(app)
                .get('/individuals/notMyId')
                .set('Authorization', 'Bearer function_stubbed')
                .expect(404);
        });
        it('returns individual when asked by himself', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(ordinaryUser);
            sinon.stub(individualService, 'getIndividual').resolves(dolly);
            const result = await supertest(app)
                .get(`/individuals/${ordinaryUser.individualId}`)
                .set('Authorization', 'Bearer function_stubbed')
                .expect(200);
            expect(result.body).to.eql(dolly);
        });
        it('returns individual when asked by ADMIN', async () => {
            sinon.stub(SessionCache.prototype, 'getSessionById').resolves(admin);
            sinon.stub(individualService, 'getIndividual').resolves(dolly);
            const result = await supertest(app)
                .get('/individuals/anything')
                .set('Authorization', 'Bearer function_stubbed')
                .expect(200);
            expect(result.body).to.eql(dolly);
        });
    });
});
