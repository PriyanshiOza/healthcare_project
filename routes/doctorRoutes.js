const express = require('express');
const authenticateJWT = require('../middlewares/authenticateJWT');
const UserModel = require('../models/userModels');

const router = express.Router();

router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.userId;
        const doctor = await UserModel.findOne({ _id: userId, account: 'doctor' });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }
        return res.status(200).json({ doctor });
    } catch (error) {
        console.error("Error fetching Doctor profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
