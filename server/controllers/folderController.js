const Folder = require("../models/folderModel");
const File = require("../models/fileModel");

//get folder by user id
const getFolderByUserID = async (req, res) => {
    console.log("/folder/getFolderByUserID");

    const { userID } = req.query;
    try {
        const folder = await Folder.getFolderByUserID(userID);
        res.status(200).send({ success: true, message: "got folder by user id", folder });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
}

//get folder list
const getFolderList = async (req, res) => {
    console.log("/folder/getFolderList");

    const { folderID } = req.query;
    try {
        const folderList = await Folder.getFolderList(folderID);
        res.status(200).send({ success: true, message: "got folder list", folderList });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
}

//create folder
const createFolder = async (req, res) => {
    console.log("/folder/createFolder");

    const { folderName, parentFolderID } = req.body;
    try {
        const folder = await Folder.createFolder(folderName, parentFolderID);
        res.status(200).send({ success: true, message: "created folder", folder });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
}

module.exports = { getFolderByUserID, getFolderList, createFolder };