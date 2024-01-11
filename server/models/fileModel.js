const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const fileSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    folder: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
        required: true
    },
    authorizedUsers: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastModified: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { collection: "files" });

//upload file
fileSchema.statics.uploadFile = async function (filename, mimeType, size, folderID) {
    if (!filename || !mimeType || !size || !folderID) {
        throw new Error("All fields must be filled");
    }

    const file = await this.create({
        filename,
        mimeType,
        size,
        folder: new ObjectId(folderID)
    });

    return file;
}

//get file list
fileSchema.statics.getFileList = async function (folderID) {
    if (!folderID) {
        throw new Error("All fields must be filled");
    }

    const files = await this.find({
        folder: new ObjectId(folderID)
    });

    return files;
}

//is authorized
fileSchema.statics.isAuthorized = async function (fileID, userID) {
    if (!fileID || !userID) {
        throw new Error("all fields must be filled");
    }

    const file = await this.findOne({
        _id: new ObjectId(fileID)
    });

    if (!file) {
        throw new Error("folder does not exists");
    }

    if (!file.authorizedUsers.includes(userID)) {
        throw new Error("user not authorized to access folder");
    }
}

module.exports = mongoose.model("File", fileSchema, "files");