const express = require('express');
const { body, validationResult } = require('express-validator');
const service = require('./individualsService');

const router = express.Router();

const checkAdmin = (req, res, next) => {
    if (!req.sessionEntitlementsProfile) {
        return res.status(400).json({ error: 'Server error' });
    }
    if (!req.sessionEntitlementsProfile.permissions.includes('ADMIN')) {
        return res.status(403).json({ error: 'No rights to create individuals' });
    }
    next();
};

const validationErrorFormat = validationResult.withDefaults(
    {
        formatter: (error) => ({
            code: 'VAL-INDIV',
            message: error.msg,
            field: error.param,
        }),
    },
);

router.post('/',
    checkAdmin,
    body('first_name', 'Body parameter: first_name not provided.').exists(),
    body('last_name', 'Body parameter: last_name not provided.').exists(),
    body('date_of_birth', 'Body parameter: date_of_birth not provided.').exists(),
    body('phone_number', 'Body parameter: phone_number not provided.').exists(),
    body('email', 'Body parameter: email should be an email').isEmail(),
    body('country_code', 'Body parameter: country_code should follow ISO 3166-1 alpha-2').isLength({ min: 2, max: 2 }),
    body('street1', 'Body parameter: street1 not provided.').exists(),
    body('city', 'Body parameter: city not provided.').exists(),
    body('region', 'Body parameter: region not provided.').exists(),
    body('postal_code', 'Body parameter: postal_code not provided.').exists(),
    async (req, res) => {
        const errors = validationErrorFormat(req).array();
        if (errors.length) {
            return res.status(400).json({ errors });
        }
        const individual = req.body;
        const newIndividual = await service.createIndividual(individual);
        return res.json(newIndividual);
    });

router.get('/', async (req, res) => {
    const {
        sessionEntitlementsProfile: profile,
        body: {
            limit,
            sort_type,
            starting_after,
            ending_before
        },
    } = req;

    if (!profile) {
        return res.status(400).json({ error: 'Server error' });
    }

    let result = {};
    if (!profile.permissions.includes('ADMIN')
        && !profile.permissions.includes('SUPPORT')
    ) {
        result = await service.getIndividual(profile.individualId);
    } else {
        result = await service.getManyIndividuals(limit, sort_type, starting_after, ending_before);
    }
    return res.json({ data: result });
});

router.get('/:id', (req, res) => {
    res.send('TODO');
});

router.get('/:id/limits', (req, res) => {
    res.send('TODO');
});

router.post('/:id/onboard', (req, res) => {
    res.send('TODO');
});

module.exports = router;
