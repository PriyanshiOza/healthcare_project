// routes/prescriptionRoutes.js

const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// POST request to create a new prescription
router.post('/', async (req, res) => {
    try {
      const { doctorId, patientId, message } = req.body;
      const prescription = new Prescription({ doctorId, patientId, message });
      await prescription.save();
      res.status(201).json({ success: true, message: 'Prescription request submitted successfully' });
    } catch (error) {
      console.error('Error submitting prescription request:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  module.exports = router;