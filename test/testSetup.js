const { prisma } = require('../database/db');

function setUp() {
    after(async () => prisma.$disconnect());
}

module.exports = {
    setUp,
};
