const mongoose = require('mongoose');

// Define the schema for the service model
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Ensures that each service has a unique name
  }
});

// Create a Mongoose model based on the schema
const Service = mongoose.model('Service', serviceSchema);

// Export the model
module.exports = Service;
