const Folder = require("../models/folderModel");
const File = require("../models/fileModel");

const isAuthorizedFolder = async (req, res, next) => {
    let folderID = "";
    if (req.method === "GET") {
        folderID = req.query.folderID
    }

    if (req.method === "POST") {
        folderID = req.body.folderID
    }

    try {
        await Folder.isAuthorized(folderID, req.user._id);
        next();
    } catch (err) {
        return res.status(400).send({ success: false, message: err.message });
    }
}

const isAuthorizedFile = async (req, res, next) => {
    let fileID = "";
    if (req.method === "GET") {
        fileID = req.query.fileID
    }

    if (req.method === "POST") {
        fileID = req.body.fileID
    }

    try {
        await File.isAuthorized(fileID, req.user._id);
        next();
    } catch (err) {
        return res.status(400).send({ success: false, message: err.message });
    }
}

module.exports = { isAuthorizedFolder, isAuthorizedFile };