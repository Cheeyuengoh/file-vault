const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isAuthorizedFolder } = require("../middlewares/isAuthorized");
const upload = require("../middlewares/upload");
const { uploadFile, getFileList } = require("../controllers/fileController");

router.use(isAuthenticated);
router.use(isAuthorizedFolder);
router.use("/uploadFile", upload.array("files"));
router.post("/uploadFile", uploadFile);
router.get("/getFileList", getFileList);

module.exports = router;