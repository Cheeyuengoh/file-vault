const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isAuthorizedFolder, isAuthorizedFile } = require("../middlewares/isAuthorized");
const { parseDataFolder, parseDataFile } = require("../middlewares/parseData");
const { filterEmails } = require("../middlewares/filterData");
const { uploadFile, getFileList, updateFileName, deleteFile, downloadFile, shareFile } = require("../controllers/fileController");

router.use(isAuthenticated);
router.use(["/uploadFile", "/getFileList"], [parseDataFolder, isAuthorizedFolder]);
router.post("/uploadFile", uploadFile);
router.get("/getFileList", getFileList);

router.use(["/updateFileName", "/deleteFile", "/downloadFile"], [parseDataFile, isAuthorizedFile]);
router.post("/updateFileName", updateFileName);
router.delete("/deleteFile", deleteFile);
router.get("/downloadFile", downloadFile);

router.use("/shareFile", [parseDataFile, isAuthorizedFile, filterEmails]);
router.post("/shareFile", shareFile);


module.exports = router;