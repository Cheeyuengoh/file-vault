const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isAuthorizedFolder } = require("../middlewares/isAuthorized");
const { parseDataFolder } = require("../middlewares/parseData");
const { filterEmails } = require("../middlewares/filterData");
const { createFolder, getFolderList, getFolderPath, updateFolderName, shareFolder } = require("../controllers/folderController");

router.use(isAuthenticated);
router.use(parseDataFolder);
router.use(isAuthorizedFolder);
router.post("/createFolder", createFolder);
router.get("/getFolderList", getFolderList);
router.get("/getFolderPath", getFolderPath);
router.post("/updateFolderName", updateFolderName);

router.use("/shareFolder", [parseDataFolder, isAuthorizedFolder, filterEmails]);
router.post("/shareFolder", shareFolder);

module.exports = router;