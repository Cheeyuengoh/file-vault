const Folder = require("../models/folderModel");

//create folder
const createFolder = async (req, res) => {
    console.log("/folder/createFolder");

    const { folderName, folderID } = req.body;
    try {
        const parentFolder = await Folder.getFolderByID(folderID);
        const folder = await Folder.createFolder(folderName, parentFolder._id, parentFolder.path, req.user._id);
        res.status(200).send({ success: true, message: "created folder", folder });
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

//get folder path
const getFolderPath = async (req, res) => {
    console.log("/folder/getFolderPath");

    const { folderID } = req.query;
    try {
        const folder = await Folder.getFolderPath(folderID);
        res.status(200).send({ success: true, message: "got folder path", path: folder.path });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
}

module.exports = { createFolder, getFolderList, getFolderPath };