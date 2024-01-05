const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const folderSchema = new Schema({
    folderName: {
        type: String,
        required: true
    },
    parentFolder: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
        required: true
    },
    files: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "File"
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
}, { collection: "folders" });

//get folder by user id
folderSchema.statics.getFolderByUserID = async function (userID) {
    if (!userID) {
        throw new Error("all fields must be filled");
    }

    const folder = await this.findOne({
        user: new ObjectId(userID)
    });

    if (!folder) {
        throw new Error("folder not found");
    }

    return folder;
}

//get folder list
folderSchema.statics.getFolderList = async function (folderID) {
    if (!folderID) {
        throw new Error("all fields must be filled");
    }

    const folders = await this.find({
        parentFolder: new ObjectId(folderID)
    });

    return folders;
}

//create folder
folderSchema.statics.createFolder = async function (folderName, parentFolderID) {
    if (!folderName || !parentFolderID) {
        throw new Error("all fields must be filled");
    }

    const folder = await this.create({
        folderName,
        parentFolder: new ObjectId(parentFolderID)
    });

    return folder;
}

module.exports = mongoose.model("Folder", folderSchema, "folders");