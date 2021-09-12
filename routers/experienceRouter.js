const express = require('express');

const experienceController = require('../controllers/experienceController');

const router = express.Router();

router.route('/')
    .get(experienceController.getAllExperiences);

module.exports = router;