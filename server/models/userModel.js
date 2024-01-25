const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rootFolder: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
        default: null
    },
    share: {
        folders: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: "Folder",
                required: true
            }],
        },
        files: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: "File",
                required: true
            }]
        }
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
}, { collection: "users" });

//register user
userSchema.statics.registerUser = async function (email, password, session) {
    if (!email || !password) {
        throw new Error("all fields must be filled");
    }

    const emailExists = await this.findOne({ email });
    if (emailExists) {
        throw new Error("email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await this.create([{
        email,
        password: hashedPassword
    }], {
        session
    });

    return user;
}

//login user
userSchema.statics.loginUser = async function (email, password) {
    if (!email) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("incorrect email or password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("incorrect email or password");
    }

    return user;
}

//update root folder
userSchema.statics.updateRootFolder = async function (userID, rootFolderID, session) {
    if (!userID || !rootFolderID) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOneAndUpdate({
        _id: new ObjectId(userID)
    }, {
        $set: {
            rootFolder: new ObjectId(rootFolderID)
        }
    }, {
        session,
        new: true
    });

    return user;
}

//get user by id
userSchema.statics.getUserByID = async function (userID) {
    if (!userID) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOne({
        _id: new ObjectId(userID)
    });

    if (!user) {
        throw new Error("user not found");
    }

    return user;
}

//get user by email
userSchema.statics.getUserByEmail = async function (email) {
    if (!email) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOne({
        email
    });

    if (!user) {
        throw new Error("user not found");
    }

    return user;
}

//add share file
userSchema.statics.addShareFile = async function (userID, fileID, session) {
    if (!userID || !fileID) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOneAndUpdate({
        _id: new ObjectId(userID)
    }, {
        $push: {
            "share.files": new ObjectId(fileID)
        }
    }, {
        session,
        new: true
    });

    return user;
}

//add share folder
userSchema.statics.addShareFolder = async function (userID, folderID, session) {
    if (!userID || !folderID) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOneAndUpdate({
        _id: new ObjectId(userID)
    }, {
        $push: {
            "share.folders": new ObjectId(folderID)
        }
    }, {
        session,
        new: true
    });

    return user;
}

//remove share file
userSchema.statics.removeShareFile = async function (userID, fileID, session) {
    if (!userID || !fileID) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOneAndUpdate({
        _id: new ObjectId(userID)
    }, {
        $pull: {
            "share.files": fileID
        }
    }, {
        session,
        new: true
    });

    return user;
}

//remove folder
userSchema.statics.removeShareFolder = async function (userID, folderID, session) {
    if (!userID || !folderID) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOneAndUpdate({
        _id: new ObjectId(userID)
    }, {
        $pull: {
            "share.folders": folderID
        }
    }, {
        session,
        new: true
    });

    return user;
}

//get share file list
userSchema.statics.getShareFileList = async function (userID) {
    if (!userID) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOne({
        _id: new ObjectId(userID)
    }).populate({
        path: "share",
        populate: {
            path: "files",
            model: "File"
        }
    });

    return user.share.files;
}

//fet share folder list
userSchema.statics.getShareFolderList = async function (userID) {
    if (!userID) {
        throw new Error("all fields must be filled");
    }

    const user = await this.findOne({
        _id: new ObjectId(userID)
    }).populate({
        path: "share",
        populate: {
            path: "folders",
            model: "Folder"
        }
    });

    return user.share.folders;
}

module.exports = mongoose.model("User", userSchema, "users");