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
            const file = await File.uploadFile(files[i].originalFilename, files[i].mimetype, files[i].originalFilename.split(".")[1], files[i].size, fields.folderID, user._id);
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

//update file name
const updateFileName = async (req, res) => {
    console.log("/file/updateFileName");

    const { fileID, rename } = req.body;
    console.log(fileID, rename);
    try {
        const file = await File.updateFileName(fileID, rename);
        res.status(200).send({ message: "updated file name", data: file });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

//remove file
const deleteFile = async (req, res) => {
    console.log("/file/deleteFile");

    const { fileID } = req.query;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const file = await File.getFileByID(fileID);
        for (const user of file.authorizedUsers) {
            if (user.role !== "owner") {
                const updatedUser = await User.removeShareFile(user.user, fileID, session);
            }
        }

        const index = file.authorizedUsers.findIndex((user) => {
            return user.role === "owner";
        });
        const owner = file.authorizedUsers[index].user;
        const path = "./storage/" + owner + "/" + file._id + "." + file.extension;
        fs.unlinkSync(path);
        const deletedFile = await File.deleteFile(fileID, session);

        await session.commitTransaction();

        res.status(200).send({ message: "deleted file" });
    } catch (err) {
        await session.abortTransaction();
        res.status(400).send({ message: err.message });
    }
    await session.endSession();
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

module.exports = { uploadFile, getFileList, updateFileName, deleteFile, shareFile };