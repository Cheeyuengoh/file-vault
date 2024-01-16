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
                    enum: ["create", "read", "update", "delete"]
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

//create root folder
folderSchema.statics.createRootFolder = async function (userID, session) {
    if (!userID) {
        throw new Error("all fields must be filled");
    }

    const [folder] = await this.create([{
        isRootFolder: true,
        authorizedUsers: [{
            user: new ObjectId(userID),
            role: "owner",
            accessLevel: getAccessLevel("owner")
        }]
    }], {
        session
    });

    return folder;
}

//create folder
folderSchema.statics.createFolder = async function (folderName, parentFolderID, userID) {
    if (!folderName || !parentFolderID || !userID) {
        throw new Error("all fields must be filled");
    }

    const [folder] = await this.create([{
        isRootFolder: false,
        folderName,
        parentFolder: new ObjectId(parentFolderID),
        authorizedUsers: [{
            user: new ObjectId(userID),
            role: "owner",
            accessLevel: getAccessLevel("owner")
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

    const [filtered] = folder.authorizedUsers.filter((obj) => {
        return obj.user.equals(userID);
    });

    if (!filtered) {
        throw new Error("user does not have access to folder");
    }

    if (!filtered.accessLevel.includes(action)) {
        throw new Error(`user not authorized to ${action} folder`);
    }
}

folderSchema.statics.getParentFolder = async function (folderID) {
    if (!folderID) {
        throw new Error("all fields must be filled");
    }

    const folder = await this.findOne({
        _id: new ObjectId(folderID)
    }).populate("parentFolder");

    if (!folder) {
        throw new Error("folder does not exists");
    }

    return folder.parentFolder;
}

folderSchema.statics.addAuthorizedUser = async function (folderID, userID, role, session) {
    if (!folderID || !userID || !role) {
        throw new Error("all fields must be filled");
    }

    const folder = await this.findOne({
        _id: new ObjectId(folderID)
    });

    if (!folder) {
        throw new Error("file does not exists");
    }


    folder.authorizedUsers.push({
        user: new ObjectId(userID),
        role,
        accessLevel: getAccessLevel(role)
    });
    folder.lastModified = Date.now();
    const updatedFolder = await folder.save({
        session
    });

    return updatedFolder;
}

module.exports = mongoose.model("Folder", folderSchema, "folders");

function getAccessLevel(role) {
    switch (role) {
        case "owner":
            return ["create", "read", "update", "delete"];
        case "editor":
            return ["create", "read", "update", "delete"];
        case "viewer":
            return ["read"];
        default:
            return [];
    }
}