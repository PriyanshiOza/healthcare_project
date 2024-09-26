// controllers/serviceController.js
const Service = require('../models/serviceModels');

// Controller function to create a new service
exports.createService = async (req, res) => {
  try {
    const { name } = req.body;
    const service = await Service.create({ name });
    res.status(201).json({ success: true, service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, error: 'Failed to create service' });
  }
};

// Controller function to get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
};
