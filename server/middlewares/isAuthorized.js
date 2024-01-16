const Folder = require("../models/folderModel");
const File = require("../models/fileModel");

const isAuthorizedFolder = async (req, res, next) => {
    const { user, isAuthorized } = req;
    try {
        await Folder.isAuthorized(isAuthorized.folderID, user._id, isAuthorized.action);
        next();
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
}

//not ready
const isAuthorizedFile = async (req, res, next) => {
    const { user, isAuthorized } = req;
    try {
        await File.isAuthorized(isAuthorized.fileID, user._id, isAuthorized.action);
        next();
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
}

module.exports = { isAuthorizedFolder, isAuthorizedFile };