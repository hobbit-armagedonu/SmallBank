const { v4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createIndividual(individual) {
    const newUUID = v4();
    const newIndividual = { ...individual, id: newUUID };

    await prisma.individual.create({ data: newIndividual });
    return newIndividual;
}

async function getIndividual(id) {
    return prisma.individuals.findUnique({
        where: {
            id,
        },
    });
}

async function disconnectPrisma() {
    return prisma.$disconnect();
}

module.exports = {
    createIndividual,
    getIndividual,
    disconnectPrisma,
};