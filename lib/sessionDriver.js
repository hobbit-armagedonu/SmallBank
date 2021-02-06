const Cache = require('node-cache');
const { v4 } = require('uuid');

const SESSION_EXPIRATION_TIME_SECONDS = 60 * 10;

class SessionCache {
    constructor() {
        if (!SessionCache.instance) {
            SessionCache.instance = new Cache();
        }
    }

    /**
     * Creates a session, cahces it and returns it's key. Generates UUID.
     * @param {string[]} permissions - list of user permissions
     */
    async createSession(permissions) {
        const sessionUUID = v4();
        SessionCache.instance.set(sessionUUID, permissions, SESSION_EXPIRATION_TIME_SECONDS);
        return sessionUUID;
    }

    async getSessionById(sessionId) {
        return SessionCache.instance.get(sessionId);
    }

    async refreshSession(sessionId) {
        SessionCache.instance.ttl(sessionId, SESSION_EXPIRATION_TIME_SECONDS);
    }
}

module.exports = SessionCache;
