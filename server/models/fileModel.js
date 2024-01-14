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
    isAuthorized: {
        type: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                required: true,
                enum: ["owner", "editor", "viewer"]
            },
            accessLevel: {
                type: [{
                    type: String,
                    required: true,
                    enum: ["share", "read", "update", "delete"]
                }],
                required: true
            },
            _id: false
        }],
        required: true
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
fileSchema.statics.uploadFile = async function (filename, mimeType, size, folderID, userID) {
    if (!filename || !mimeType || !size || !folderID) {
        throw new Error("All fields must be filled");
    }

    const file = await this.create({
        filename,
        mimeType,
        size,
        folder: new ObjectId(folderID),
        isAuthorized: [{
            user: new ObjectId(userID),
            role: "owner",
            accessLevel: ["share", "read", "update", "delete"]
        }]
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
fileSchema.statics.isAuthorized = async function (fileID, userID, action) {
    if (!fileID || !userID || !action) {
        throw new Error("all fields must be filled");
    }

    const file = await this.findOne({
        _id: new ObjectId(fileID)
    });

    if (!file) {
        throw new Error("file does not exists");
    }

    const filtered = file.isAuthorized.filter((obj) => {
        return obj.user === userID;
    });

    if (!filtered) {
        throw new Error("user does not have access to file");
    }

    if (!filtered.accessLevel.includes(action)) {
        throw new Error(`user not authorized to ${action} file`);
    }
}

fileSchema.statics.updateFilename = async function (fileID, filename) {
    if (!fileID || !filename) {
        throw new Error("all fields must be filled");
    }

    const file = await this.findOneAndUpdate({
        _id: new ObjectId(fileID)
    }, {
        $set: {
            filename
        }
    }, {
        new: true
    });

    return file;
}

fileSchema.statics.deleteFile = async function (fileID) {
    if (fileID) {
        throw new Error("all fields must be filled");
    }

    const file = await this.deleteOne({
        _id: new ObjectId(fileID)
    });

    return file;
}

module.exports = mongoose.model("File", fileSchema, "files");