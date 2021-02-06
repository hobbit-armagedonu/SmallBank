const SessionDriver = require('./sessionDriver');
const { getUserByToken } = require('./fakeAuthService');

const driver = new SessionDriver();
/*
 * Use a common token to create an internal API sessionUID
 * used later to authenticate other bank calls
 * @param {string} token common company auth token
 */
async function login(token) {
    const user = await getUserByToken(token);

    if (!user) {
        throw new Error('Invalid token');
    }

    if (!user.permissions) {
        throw new Error('User has no permissions');
    }

    const { permissions } = user;

    const sessionId = await driver.createSession(permissions);
    return sessionId;
}
/**
 * Verifies that the session exists, refreshes it and returns permissions associated
 * with the user/session
 * @param {string} sessionId UUID
 * @returns {string[]}
 */
async function getSessionPermissions(sessionId) {
    const permissions = await driver.getSessionById(sessionId);
    if (!permissions) {
        throw new Error('Session Expired');
    }
    driver.refreshSession(sessionId); /* NO WAIT */
    return permissions;
}

module.exports = {
    login,
    getSessionPermissions,
};