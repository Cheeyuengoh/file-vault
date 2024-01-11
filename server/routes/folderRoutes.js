const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isAuthorizedFolder } = require("../middlewares/isAuthorized");
const { parseDataFolder } = require("../middlewares/parseData");
const { createFolder, getFolderList, getFolderPath } = require("../controllers/folderController");

router.use(isAuthenticated);
router.use(parseDataFolder);
router.use(isAuthorizedFolder);
router.post("/createFolder", createFolder);
router.get("/getFolderList", getFolderList);
router.get("/getFolderPath", getFolderPath);

module.exports = router;