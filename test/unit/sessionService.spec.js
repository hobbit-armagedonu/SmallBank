const chai = require('chai');
const asPromised = require('chai-as-promised');
const { stub, spy, useFakeTimers } = require('sinon');
const { login, getSessionEntitlementsProfile } = require('../../lib/sessionService');
const fakeAuth = require('../../lib/fakeAuthService');
const { SessionCache, SESSION_EXPIRATION_TIME_SECONDS } = require('../../lib/sessionDriver');

const { expect } = chai;
chai.use(asPromised);

describe('sessionService', () => {
    let fakeUser;
    let expectedProfile;

    beforeEach(() => {
        fakeUser = {
            username: 'Tom',
            token: 'yyy',
            permissions: ['USER'],
            individualId: '666-666',
        };
        expectedProfile = {
            permissions: fakeUser.permissions,
            individualId: fakeUser.individualId,
        };
    });

    describe('login', () => {
        it('should create a new session and save it so that it is later available for read', async () => {
            const getUserStub = stub(fakeAuth, 'getUserByToken').resolves(fakeUser);
            const driverSpy = spy(SessionCache.prototype, 'createSession');

            const session = await login(fakeUser.token);
            const permissions = await getSessionEntitlementsProfile(session);

            expect(permissions).to.eql(expectedProfile);
            expect(getUserStub.callCount).to.be.equal(1);
            expect(driverSpy.callCount).to.be.equal(1);
        });

        it('should create a session that expires', async () => {
            const clock = useFakeTimers();
            const session = await login(fakeUser.token);
            const timeJump = (SESSION_EXPIRATION_TIME_SECONDS * 1000) + 1;
            clock.tick(timeJump);

            return expect(getSessionEntitlementsProfile(session))
                .to.be.rejectedWith('Session Expired')
                .then(() => {
                    clock.restore();
                });
        });
    });

    describe('getSessionEntitlementsProfile', () => {
        it('should refresh the session expiration time', async () => {
            const driverSpy = spy(SessionCache.prototype, 'refreshSession');
            const clock = useFakeTimers();
            const session = await login(fakeUser.token);
            const timeJump = (SESSION_EXPIRATION_TIME_SECONDS * 1000) - 1;
            clock.tick(timeJump);
            await getSessionEntitlementsProfile(session);
            clock.tick(timeJump); /* if session would not get refreshed this should expire it */
            return expect(getSessionEntitlementsProfile(session))
                .to.eventually.eql(expectedProfile)
                .then(() => {
                    expect(driverSpy.callCount).to.be.equal(2); /* refresh call and tested call */
                    clock.restore();
                });
        });
    });
});
