const Folder = require("../models/folderModel");
const File = require("../models/fileModel");
const formidable = require("formidable");

const isAuthorizedFolder = async (req, res, next) => {
    try {
        await Folder.isAuthorized(req.folderID, req.user._id);
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