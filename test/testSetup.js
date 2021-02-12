const { prisma } = require('../database/db');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

async function executeReload() {
    const { stdout, stderr } = await exec('database/reloadUnitTestDB.sh');
    console.log(stdout);
    console.error(stderr);
}

function setUp() {
    after(async () => prisma.$disconnect());

    before(async () => {
        await executeReload();
    });
}

module.exports = {
    setUp,
};
