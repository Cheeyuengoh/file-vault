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
            req.isAuthorized = {
                folderID: field.folderID[0],
                action: field.action[0]
            }
            req.fields = {
                folderID: field.folderID[0]
            };
            req.files = file.files;
            next();
        } catch (err) {
            return res.status(400).send({ success: false, message: err.message });
        }
    }

    if (req.method === "POST" && req.is("application/json")) {
        req.isAuthorized = {
            folderID: req.body.folderID,
            action: req.body.action
        }
        next();
    }

    if (req.method === "GET") {
        req.isAuthorized = {
            folderID: req.query.folderID,
            action: "read"
        }
        next();
    }
}

module.exports = { parseDataFolder };