const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { createIndividual, getIndividual } = require('../../lib/individuals/individualsService');
const { prisma } = require('../../database/db');
const { setUp } = require('../testSetup');

const { expect } = chai;
chai.use(chaiAsPromised);
setUp();

describe('individualsService', () => {
    describe('createIndividual', () => {
        let dolly;

        beforeEach(() => {
            dolly = {
                id: '424cd60f-f494-410f-ac99-f939ce687f14',
                first_name: 'Dolly',
                last_name: 'Parton',
                date_of_birth: '1962-01-04',
                email: 'dolly.parton@yahoo.com',
                country_code: 'US',
                phone_number: '+1707653356',
                street1: 'Country drive 69',
                street2: 'door 3',
                city: 'Austin',
                region: 'Texas',
                postal_code: 'XXXXXX',
                individual_status_code: 'PEN',
            };
        });

        it('should save an individual to the database and return it with new id', async () => {
            const dollyCopy = await createIndividual(dolly);
            expect(dollyCopy.id).to.not.be.equal(dolly.id);

            return expect(prisma.individual.findUnique({
                where: { id: dollyCopy.id },
            })).to.eventually.eql(dollyCopy)
                .then(async (newDolly) => {
                    expect(newDolly.first_name).to.be.equal(dolly.first_name);
                });
        });
    });
});
