const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const folderSchema = new Schema({
    isRootFolder: {
        type: Boolean,
        required: true
    },
    folderName: {
        type: String,
        required: function () {
            return !this.isRootFolder;
        }
    },
    parentFolder: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
        required: function () {
            return !this.isRootFolder
        }
    },
    path: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Folder"
        }],
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
                    enum: ["share", "upload", "create", "read", "update", "delete"]
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
}, { collection: "folders" });

//create folder
folderSchema.statics.createRootFolder = async function (userID, session) {
    if (!userID) {
        throw new Error("all fields must be filled");
    }

    const [folder] = await this.create([{
        isRootFolder: true,
        path: [],
        isAuthorized: [{
            user: new ObjectId(userID),
            role: "owner",
            accessLevel: ["share", "upload", "create", "read", "update", "delete"]
        }]
    }], {
        session
    });

    return folder;
}

folderSchema.statics.createFolder = async function (folderName, parentFolderID, path, userID) {

    if (!folderName || !parentFolderID || !path || !userID) {
        throw new Error("all fields must be filled");
    }

    if (path) path.push(parentFolderID);

    const [folder] = await this.create([{
        isRootFolder: false,
        folderName,
        parentFolder: new ObjectId(parentFolderID),
        path: path.map((folderID) => {
            return new ObjectId(folderID)
        }),
        isAuthorized: [{
            user: new ObjectId(userID),
            role: "owner",
            accessLevel: ["share", "upload", "create", "read", "update", "delete"]
        }]
    }]);

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
    }).populate("path");

    if (!folder) {
        throw new Error("folder does not exists");
    }

    return folder;
}

//is authorized
folderSchema.statics.isAuthorized = async function (folderID, userID, action) {
    if (!folderID || !userID || !action) {
        throw new Error("all fields must be filled");
    }

    const folder = await this.findOne({
        _id: new ObjectId(folderID)
    });

    if (!folder) {
        throw new Error("folder does not exists");
    }

    const [filtered] = folder.isAuthorized.filter((obj) => {
        return obj.user.equals(userID);
    });

    if (!filtered) {
        throw new Error("user does not have access to folder");
    }
    if (!filtered.accessLevel.includes(action)) {
        throw new Error(`user not authorized to ${action} folder`);
    }
}

folderSchema.statics.updateFolderName = async function (folderID, folderName) {
    if (!folderID || !folderName) {
        throw new Error("all fields must be filled");
    }

    const folder = await this.findOneAndUpdate({
        _id: new ObjectId(folderID)
    }, {
        $set: {
            folderName
        }
    }, {
        new: true
    });

    return folder;
}

folderSchema.statics.deleteFolder = async function (folderID) {
    if (folderID) {
        throw new Error("all fields must be filled");
    }

    const folder = await this.deleteOne({
        _id: new ObjectId(folderID)
    });

    return folder;
}

module.exports = mongoose.model("Folder", folderSchema, "folders");