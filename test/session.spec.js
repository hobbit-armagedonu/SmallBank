const supertest = require('supertest');
const { expect } = require('chai');
const { app, server } = require('../bank');
const { setUp } = require('./testSetup');

setUp();

describe('/login', () => {
    after(() => {
        server.close();
    });

    it('given valid api_key returns a sessionID as access_token', async () => {
        const response = await supertest(app)
            .post('/login')
            .send({ api_key: 'xxxx' })
            .expect(200);
        expect(response.body.access_token).to.be.a('string');
        expect(response.body.access_token.length).to.be.equal(36);
    });
});
