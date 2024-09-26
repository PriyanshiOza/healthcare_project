// routes/protectedRoute.js

const express = require('express');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.get('/protected-route', authenticateJWT, (req, res) => {
  // Print the req.user object in the console
  console.log("Authenticated user:", req.user);

  // Respond with a JSON message
  res.json({ message: "You are authenticated!" });
});

module.exports = router;
