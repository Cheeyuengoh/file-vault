const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const rootFolderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
rootFolderSchema.statics.createRootFolder = async function (userID, session) {
    if (!userID) {
        throw new Error("All fields must be filled");
    }

    const rootFolder = await this.create({
        user: new ObjectId(userID)
    }, {
        session
    });

    return rootFolder;
}

module.exports = mongoose.model("RootFolder", rootFolderSchema, "folders");