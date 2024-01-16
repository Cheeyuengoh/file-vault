const fs = require("fs");
const File = require("../models/fileModel");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");

//upload file
const uploadFile = async (req, res) => {
    console.log("/file/uploadFile");

    const { user, fields, files } = req;
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
        try {
            const file = await File.uploadFile(files[i].originalFilename, files[i].mimetype, files[i].size, fields.folderID, user._id);
            fs.renameSync(files[i].filepath, "./storage/" + user._id + "/" + file._id + "." + files[i].originalFilename.split(".")[1]);
            fileList.push(file);
        } catch (err) {
            fs.unlinkSync(files[i].filepath);
            return res.status(400).send({ message: err.message });
        }
    }

    res.status(200).send({ message: "uploaded file", data: fileList });
}

//get file list
const getFileList = async (req, res) => {
    console.log("/file/getFileList");

    const { folderID } = req.query;
    try {
        const fileList = await File.getFileList(folderID);
        res.status(200).send({ message: "got file list", data: fileList });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

//share file
const shareFile = async (req, res) => {
    console.log("/file/shareFile");

    const { fileID, role } = req.body;
    const { validUsers, invalidUsers } = req.filtered;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        for (const validUser of validUsers) {
            const file = await File.addAuthorizedUser(fileID, validUser._id, role, session);
            const user = await User.addShareFile(validUser._id, file._id, session);
        }
        await session.commitTransaction();

        res.status(200).send({ message: "shared file", data: { notShared: invalidUsers } });
    } catch (err) {
        await session.abortTransaction();
        res.status(400).send({ message: err.message });
    }
    await session.endSession();
}

module.exports = { uploadFile, getFileList, shareFile };