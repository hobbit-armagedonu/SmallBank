const users = [
    {
        username: 'Tom',
        token: 'xxxx',
        permissions: ['ACCOUNT', 'CARD', 'EVENTS'],
    },
    {
        username: 'Jerry',
        token: 'yyyy',
        permissions: ['ACCOUNT', 'CARD', 'EVENT', 'TRANSACTION'],
    },
    {
        username: 'Mickey',
        token: 'zzzz',
        permissions: ['ACCOUNT', 'CARD', 'EVENTS', 'PCILESS'],
    },
];

/**
 * In real world this will be a real service
 * @param {string} token - common authentication token
 */
async function getUserByToken(token) {
    return users.filter((user) => user.token === token)[0];
}

module.exports = {
    getUserByToken,
};
