const jwt = require("jsonwebtoken");
const User = require('../models/userModel');

const isAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).send({ success: false, message: "no access token provided" });
    }

    const token = authorization.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.getUserByID(payload.user._id);
        req.user = user;
        next();
    } catch (err) {
        return res.status(400).send({ success: false, message: err.message });
    }
}

module.exports = { isAuthenticated }