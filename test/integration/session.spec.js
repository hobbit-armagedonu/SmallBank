const sinon = require('sinon');
const supertest = require('supertest');
const { expect } = require('chai');
const { app, server } = require('../../bank');
const { setUp } = require('../testSetup');
const fakeAuth = require('../../lib/fakeAuthService');

setUp();

describe('/login', () => {
    after(() => {
        server.close();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('given valid api_key returns a sessionID as access_token', async () => {
        const response = await supertest(app)
            .post('/login')
            .send({ api_key: 'xxxx' }) /* surprisingly this is a valid key */
            .expect(200);
        expect(response.body.access_token).to.be.a('string');
        expect(response.body.access_token.length).to.be.equal(36);
    });

    it('given invalid api_key returns 400 and proper message', async () => {
        const error = await supertest(app)
            .post('/login')
            .send({ api_key: 'weird' })
            .expect(400);
        expect(error.body.error).to.be.equal('Invalid api_key');
    });

    it('handles invalid parameter', async () => {
        const expectedError = {
            errors: [
                {
                    code: 'VAL-LOGIN',
                    field: 'api_key',
                    message: 'Body parameter: api_key not provided.',
                },
            ],
        };
        const error = await supertest(app)
            .post('/login')
            .send({ weird_key: 'weird_value' })
            .expect(400);
        expect(error.body).to.eql(expectedError);
    });

    it('given api_key of a user with no permissions returns 400', async () => {
        const userNoPermissions = {
            first_name: 'SadJohn',
        };
        const authStub = sinon.stub(fakeAuth, 'getUserByToken').resolves(userNoPermissions);
        const error = await supertest(app)
            .post('/login')
            .send({ api_key: 'stubbed' })
            .expect(400);
        expect(error.body.error).to.be.equal('User has no permissions');
        expect(authStub.callCount).to.be.equal(1);
    });
});
