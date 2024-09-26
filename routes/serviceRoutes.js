// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceControllers');

// Route to create a new service
router.post('/services', serviceController.createService);

// Route to get all services
router.get('/services', serviceController.getAllServices);

module.exports = router;
