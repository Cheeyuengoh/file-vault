const router = require("express").Router();
const { registerUser, loginUser, getShareFolderList, getShareFileList } = require("../controllers/userController");

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.get("/getShareFolderList", getShareFolderList);
router.get("/getShareFileList", getShareFileList);

module.exports = router;