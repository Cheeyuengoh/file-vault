const router = require("express").Router();
const { isAuthorizedFolder } = require("../middlewares/isAuthorized");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { createFolder, getFolderList, getFolderPath } = require("../controllers/folderController");

router.use(isAuthenticated);
router.use(isAuthorizedFolder);
router.post("/createFolder", createFolder);
router.get("/getFolderList", getFolderList);
router.get("/getFolderPath", getFolderPath);

module.exports = router;