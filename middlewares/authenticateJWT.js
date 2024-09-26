const jwt = require('jsonwebtoken');

// Middleware to extract patient ID from token
const extractPatientId = (req, res, next) => {
  // Check if token exists in headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, 'your-secret-key');
    
    // Extract patient ID from decoded token payload
    req.patientId = decoded.patientId;

    // Call next middleware
    next();
  } catch (error) {
    console.error('Error extracting patient ID from token:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to authenticate user and extract user data from token
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization; // Assuming token is sent in the Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key'); // Verify and decode the token
    req.user = decoded; // Attach decoded user data to the request object
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
module.exports = extractPatientId,authenticateUser;
