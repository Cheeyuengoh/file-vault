const router = require("express").Router();
const { isAuth } = require("../middlewares/isAuth");
const { createFolder, getFolderList, getFolderPath } = require("../controllers/folderController");

router.use(isAuth);
router.post("/createFolder", createFolder);
router.get("/getFolderList", getFolderList);
router.get("/getFolderPath", getFolderPath);

module.exports = router;