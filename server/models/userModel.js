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

module.exports = mongoose.model("User", userSchema, "users");