const { expect } = require('chai');
const individualService = require('../../lib/individuals/individualsService');

describe('individualService (UNIT)', () => {
    describe('getStatusCode', () => {
        it('returns the database code of the given status name', () => {
            expect(individualService.getStatusCode('onboarding_data_provided')).to.be.equal('ONB');
        });
    });
});
