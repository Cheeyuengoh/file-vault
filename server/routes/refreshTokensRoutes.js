const router = require("express").Router();
const { refreshTokens } = require("../controllers/refreshTokensController");

router.post("/", refreshTokens);

module.exports = router;