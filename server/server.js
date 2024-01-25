const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const folderRoutes = require("./routes/folderRoutes");
const fileRoutes = require("./routes/fileRoutes");
const refreshTokensRoutes = require("./routes/refreshTokensRoutes");

const PORT = process.env.PORT || 5050;
const app = express();

//middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./storage"));

//routes
app.use("/refreshTokens", refreshTokensRoutes);
app.use("/user", userRoutes);
app.use("/folder", folderRoutes);
app.use("/file", fileRoutes);

mongoose.connect(process.env.ATLAS, { dbName: "file-vault" })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log("Server is running on port:", PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });