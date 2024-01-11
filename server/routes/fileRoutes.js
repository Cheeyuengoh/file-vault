const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isAuthorizedFolder } = require("../middlewares/isAuthorized");
const { parseDataFolder } = require("../middlewares/parseData");
const { uploadFile, getFileList } = require("../controllers/fileController");

router.use(isAuthenticated);
router.use(parseDataFolder);
router.use(isAuthorizedFolder);
router.post("/uploadFile", uploadFile);
router.get("/getFileList", getFileList);

module.exports = router;