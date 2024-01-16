const mongoose = require("mongoose");
const fs = require("fs");
const { generateAccessToken, generateRefreshToken } = require("./generations/tokens");
const User = require("../models/userModel");
const Folder = require("../models/folderModel");

//register user
const registerUser = async (req, res) => {
    console.log("/user/registerUser");

    const { email, password } = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const user = await User.registerUser(email, password, session);
        const folder = await Folder.createRootFolder(user._id, session);
        const updatedUser = await User.updateRootFolder(user._id, folder._id, session);
        await session.commitTransaction();

        fs.mkdirSync("./storage/" + user._id);

        const accessToken = generateAccessToken({ user: { _id: updatedUser._id } });
        const refreshToken = generateRefreshToken({ user: { _id: updatedUser._id } });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        res.status(200).send({ message: "registered user", data: { ...user.toObject(), accessToken } });
    } catch (err) {
        await session.abortTransaction();
        res.status(400).send({ message: err.message });
    }
    await session.endSession();
}

//login user
const loginUser = async (req, res) => {
    console.log("/user/loginUser");

    const { email, password } = req.body;
    try {
        const user = await User.loginUser(email, password);

        const accessToken = generateAccessToken({ user: { _id: user._id } });
        const refreshToken = generateRefreshToken({ user: { _id: user._id } });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        res.status(200).send({ message: "logined user", data: { ...user.toObject(), accessToken } });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

//get share folder
const getShareFolderList = async (req, res) => {
    console.log("/user/getShareFolderList");

    const { userID } = req.query;
    try {
        const folderList = await User.getShareFolderList(userID);
        res.status(200).send({ message: "got share folder list", data: folderList });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

//get share file list
const getShareFileList = async (req, res) => {
    console.log("/user/getShareFileList");

    const { userID } = req.query;
    try {
        const fileList = await User.getShareFileList(userID);
        res.status(200).send({ message: "got share file list", data: fileList });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

module.exports = { registerUser, loginUser, getShareFolderList, getShareFileList };