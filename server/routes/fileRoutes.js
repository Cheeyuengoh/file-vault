const router = require("express").Router();
const upload = require("../middlewares/upload");
const { uploadFile, getFileList } = require("../controllers/fileController");

router.use("/uploadFile", upload.array("files"));
router.post("/uploadFile", uploadFile);
router.get("/getFileList", getFileList);

module.exports = router;