const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const fileSchema = new Schema({
    fileName: {
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
                    enum: ["read", "update", "delete"]
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
fileSchema.statics.uploadFile = async function (fileName, mimeType, size, folderID, userID) {
    if (!fileName || !mimeType || !size || !folderID) {
        throw new Error("All fields must be filled");
    }

    const file = await this.create({
        fileName,
        mimeType,
        size,
        folder: new ObjectId(folderID),
        authorizedUsers: [{
            user: new ObjectId(userID),
            role: "owner",
            accessLevel: getAccessLevel("owner")
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

    const [filtered] = file.authorizedUsers.filter((obj) => {
        return obj.user.equals(userID);
    });

    if (!filtered) {
        throw new Error("user does not have access to file");
    }

    if (!filtered.accessLevel.includes(action)) {
        throw new Error(`user not authorized to ${action} file`);
    }
}

fileSchema.statics.addAuthorizedUser = async function (fileID, userID, role, session) {
    if (!fileID || !userID || !role) {
        throw new Error("all fields must be filled");
    }

    const file = await this.findOne({
        _id: new ObjectId(fileID)
    });

    if (!file) {
        throw new Error("file does not exists");
    }

    file.authorizedUsers.push({
        user: new ObjectId(userID),
        role,
        accessLevel: getAccessLevel(role)
    });
    file.lastModified = Date.now();
    const updatedFile = await file.save({
        session
    });

    return updatedFile;
}

fileSchema.statics.updateFileName = async function (fileID, rename) {
    if (!fileID || !rename) {
        throw new Error("all fields must be filled");
    }

    const file = await this.findOneAndUpdate({
        _id: new ObjectId(fileID)
    }, {
        $set: {
            fileName: rename
        }
    }, {
        new: true
    });

    return file;
}

module.exports = mongoose.model("File", fileSchema, "files");

function getAccessLevel(role) {
    switch (role) {
        case "owner":
            return ["read", "update", "delete"];
        case "editor":
            return ["read", "update", "delete"];
        case "viewer":
            return ["read"];
        default:
            return [];
    }
}