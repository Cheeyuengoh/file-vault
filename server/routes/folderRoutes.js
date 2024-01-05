const router = require("express").Router();
const { isAuth } = require("../middlewares/isAuth");
const { getFolderByUserID, getFolderList, createFolder } = require("../controllers/folderController");

router.use(isAuth);
router.get("/getFolderByUserID", getFolderByUserID);
router.get("/getFolderList", getFolderList);
router.post("/createFolder", createFolder);

module.exports = router;