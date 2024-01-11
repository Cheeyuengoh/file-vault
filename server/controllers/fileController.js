const fs = require("fs");
const File = require("../models/fileModel");

//upload file
const uploadFile = async (req, res) => {
    console.log("/file/uploadFile");

    try {
        const fileList = [];
        for (let i = 0; i < req.files.length; i++) {
            const file = await File.uploadFile(req.files[i].originalFilename, req.files[i].mimetype, req.files[i].size, req.folderID, req.user._id);
            fs.renameSync(req.files[i].filepath, "./storage/" + req.user._id + "/" + file._id + "." +req.files[i].originalFilename.split(".")[1]);
            fileList.push(file);
        }
        res.status(200).send({ success: true, message: "uploaded file", fileList });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
}

//get file list
const getFileList = async (req, res) => {
    console.log("/file/getFileList");

    const { folderID } = req.query;
    try {
        const fileList = await File.getFileList(folderID);
        res.status(200).send({ success: false, message: "got file list", fileList });
    } catch (err) {
        res.status(400).send({ success: false, message: err.message });
    }
}


module.exports = { uploadFile, getFileList };