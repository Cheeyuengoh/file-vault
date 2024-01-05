const router = require("express").Router();
const { isAuth } = require("../middlewares/isAuth");
const { createFolder, getFolderList } = require("../controllers/folderController");

router.use(isAuth);
router.post("/createFolder", createFolder);
router.get("/getFolderList", getFolderList);

module.exports = router;