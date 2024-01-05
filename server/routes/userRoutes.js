const router = require("express").Router();
const { registerUser, loginUser } = require("../controllers/userController");

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);

module.exports = router;