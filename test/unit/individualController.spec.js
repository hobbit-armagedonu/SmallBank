const supertest = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const { app, server } = require('../../bank');
const { setUp } = require('../testSetup');
const { SessionCache } = require('../../lib/sessionDriver');
const individualService = require('../../lib/individuals/individualsService');

setUp();

describe('individuals (controller)', () => {
    let admin;
    let ordinaryUser;
    let dolly;

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
            individual_status_code: 'PEN',
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
});
