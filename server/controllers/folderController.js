const mongoose = require("mongoose");
const Folder = require("../models/folderModel");
const File = require("../models/fileModel");
const User = require("../models/userModel");

//create folder
const createFolder = async (req, res) => {
    console.log("/folder/createFolder");

    const { user } = req;
    const { folderName, folderID } = req.body;
    try {
        const folder = await Folder.createFolder(folderName, folderID, user._id);
        res.status(200).send({ message: "created folder", data: folder });
    } catch (err) {
        res.status(400).send(err);
    }
}

//get folder list
const getFolderList = async (req, res) => {
    console.log("/folder/getFolderList");

    const { folderID } = req.query;
    try {
        const folderList = await Folder.getFolderList(folderID);
        res.status(200).send({ message: "got folder list", data: folderList });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

//get folder path
const getFolderPath = async (req, res) => {
    console.log("/folder/getFolderPath");

    const { folderID, vault, userID } = req.query;
    if (vault === "my-vault") {
        try {
            const path = await getMyPath(folderID, []);
            res.status(200).send({ message: "got folder path", data: path });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }

    if (vault === "share-vault") {
        try {
            const user = await User.getUserByID(userID);
            const path = await getSharePath(folderID, user.share.folders, []);
            res.status(200).send({ message: "got folder path", data: path });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }
}

const updateFolderName = async (req, res) => {
    console.log("/folder/updateFolderName");

    const { folderID, rename } = req.body;
    try {
        const folder = await Folder.updateFolderName(folderID, rename);
        res.status(200).send({ message: "updated folder name", data: folder });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

//share folder
const shareFolder = async (req, res) => {
    console.log("/folder/shareFolder");

    const { folderID, role } = req.body;
    const { validUsers, invalidUsers } = req.filtered;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        for (const user of validUsers) {
            const updatedFolder = await Folder.addAuthorizedUser(folderID, user._id, role, session);
            const updatedUser = await User.addShareFolder(user._id, folderID, session);
        }
        await shareNestedFoldersAndFiles(folderID, validUsers, role, session);
        await session.commitTransaction();

        res.status(200).send({ message: "shared folder", data: { notShared: invalidUsers } });
    } catch (err) {
        await session.abortTransaction();
        res.status(400).send({ message: err.message });
    }
    await session.endSession();
}

module.exports = { createFolder, getFolderList, getFolderPath, updateFolderName, shareFolder };

async function getMyPath(folderID, path) {
    const parentFolder = await Folder.getParentFolder(folderID);
    if (parentFolder.isRootFolder) return path;

    const length = path.unshift(parentFolder);
    return getMyPath(parentFolder._id, path);
}

async function getSharePath(folderID, userShareFolders, path) {
    if (userShareFolders.includes(folderID)) return path;

    const parentFolder = await Folder.getParentFolder(folderID);
    path.unshift(parentFolder);

    return getSharePath(parentFolder._id, userShareFolders, path);
}

async function shareNestedFoldersAndFiles(folderID, validUsers, role, session) {
    const fileList = await File.getFileList(folderID);
    for (const file of fileList) {
        for (const user of validUsers) {
            const updatedFile = await File.addAuthorizedUser(file._id, user._id, role, session);
        }
    }

    const folderList = await Folder.getFolderList(folderID);
    if (!folderList.length) return;

    for (const folder of folderList) {
        for (const user of validUsers) {
            const updatedFolder = await Folder.addAuthorizedUser(folder._id, user._id, role, session);
        }
        return shareNestedFoldersAndFiles(folder._id, validUsers, role, session);
    }
}