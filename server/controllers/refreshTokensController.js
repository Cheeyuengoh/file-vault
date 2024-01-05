const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { generateAccessToken, generateRefreshToken } = require("./generations/tokens");

const refreshTokens = async (req, res) => {
    console.log("/refreshTokens");

    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(400).send({ success: false, message: "no refresh token provided" });
    }

    let payload = null;
    try {
        payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return res.status(400).send({ success: false, message: err.message });
    }

    let user = null;
    try {
        user = await User.getUserByID(payload.user._id);
    } catch (err) {
        return res.status(400).send({ success: false, message: err.message });
    }

    const accessToken = generateAccessToken({ user: { _id: user._id } });
    const refreshToken = generateRefreshToken({ user: { _id: user._id } });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(200).send({ success: true, user: { ...user.toObject(), accessToken } });
}

module.exports = { refreshTokens };