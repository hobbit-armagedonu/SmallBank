const { v4 } = require('uuid');
const { prisma } = require('../../database/db');
const { _ } = require('lodash');

const individualStatusMap = {
    PEN: 'pending_activation',
    REQ: 'onboarding_requested',
    ONB: 'onboarding_data_provided',
    ACT: 'activated',
    BLK: 'blocked',
};

function getStatusCode(statusName) {
    return Object.keys(individualStatusMap).find((key) => individualStatusMap[key] === statusName);
}

async function createIndividual(individual) {
    const newUUID = v4();
    const newIndividual = { ...individual, id: newUUID };

    await prisma.individual.create({ data: newIndividual });
    return newIndividual;
}

async function getIndividual(id) {
    return prisma.individual.findUnique({
        where: {
            id,
        },
    });
}

async function getManyIndividuals(limit = 100, sortType, startingAfter, endingBefore) {
    const order = sortType ? sortType.toLowerCase() : 'desc';
    const rawIndividuals = await prisma.individual.findMany({
        take: limit,
        where: {
            id: {
                gt: startingAfter,
                lt: endingBefore,
            },
        },
        orderBy: [
            {
                id: order,
            },
        ],
    });
    return rawIndividuals.map((ind) => {
        _.set(ind, 'status', individualStatusMap[ind.individual_status_code]);
        return _.omit(ind, 'individual_status_code')
    });
}

module.exports = {
    createIndividual,
    getIndividual,
    getManyIndividuals,
    getStatusCode,
};
