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
        default: null
    },
    path: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Folder"
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

//create folder
folderSchema.statics.createFolder = async function (folderName, parentFolderID, path, session) {
    if (!folderName) {
        throw new Error("all fields must be filled");
    }

    if (path) path.push(parentFolderID);

    const [folder] = await this.create([{
        folderName,
        parentFolder: parentFolderID ? new ObjectId(parentFolderID) : null,
        path: path ? path.map((folderID) => {
            return new ObjectId(folderID)
        }) : []
    }], {
        session
    });

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

//get folder by id
folderSchema.statics.getFolderByID = async function (folderID) {
    if (!folderID) {
        throw new Error("all fields must be filled");
    }

    const folder = await this.findOne({
        _id: new ObjectId(folderID)
    });

    if (!folder) {
        throw new Error("folder does not exists");
    }

    return folder;
}

//get folder path
folderSchema.statics.getFolderPath = async function (folderID) {
    if (!folderID) {
        throw new Error("all fields must be filled");
    }

    const folder = await this.findOne({
        _id: new ObjectId(folderID)
    }).populate("path", "folderName");

    if (!folder) {
        throw new Error("folder does not exists");
    }

    return folder;
}

module.exports = mongoose.model("Folder", folderSchema, "folders");