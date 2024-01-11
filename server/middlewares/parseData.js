const formidable = require("formidable");

const parseDataFolder = async (req, res, next) => {
    if (req.method === "POST" && req.is("multipart/form-data")) {
        const options = {
            uploadDir: "./temp",
            keepExtensions: true,
            multiples: true,
        }
        const form = new formidable.IncomingForm(options);

        try {
            const [field, file] = await form.parse(req);
            req.folderID = field.folderID[0];
            req.files = file.files;
            next();
        } catch (err) {
            return res.status(400).send({ success: false, message: err.message });
        }
    }

    if (req.method === "POST" && req.is("application/json")) {
        req.folderID = req.body.folderID;
        next();
    }

    if (req.method === "GET") {
        req.folderID = req.query.folderID;
        next();
    }
}

module.exports = { parseDataFolder };