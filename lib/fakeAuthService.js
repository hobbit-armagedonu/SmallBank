/* eslint-disable camelcase */
const users = [
    {
        username: 'Tom',
        token: 'xxxx',
        permissions: ['ADMIN'],
    },
    {
        username: 'Jerry',
        token: 'yyyy',
        permissions: ['ADMIN'],
    },
    {
        username: 'Mickey',
        token: 'zzzz',
        permissions: ['SUPPORT'],
    },
    {
        individualId: '28689500-45ba-4520-8e70-4afeba5a8b6f',
        username: 'OrdinaryJoe',
        token: 'abba',
        permissions: ['USER'],
    },
];

/**
 * In real world this will be a common org service
 * @param {string} token - common authentication token
 */
async function getUserByToken(token) {
    return users.filter((user) => user.token === token)[0];
}

/**
 * The real auth service should create a profile, send and email and set-up a password
 * @param {Object} individual full individual with email, Id and names
 */
async function createUser(individual) {
    const {
        first_name,
        last_name,
        id,
    } = individual;

    const newUser = {
        individualId: id,
        username: `${first_name}  ${last_name}`,
        token: 'VeryFakeToken',
        permissions: ['USER'],
    };

    users.push(newUser);
}

module.exports = {
    getUserByToken,
    createUser,
};
