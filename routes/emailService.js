const express = require("express");
const router = express.Router();

const {
  register,
  activateAccount,
  requestPwChange,
  resetPw,
} = require("../controllers/emailService");

router.post("/register", register);
router.post("/activateAccount", activateAccount);
router.post("/requestPwChange", requestPwChange);
router.post("/resetPw", resetPw);

module.exports = router;
