const express = require("express");

const router = express.Router();
const filesController = require("../controllers/filesController");

router.get("/data", filesController.getFilesData);

module.exports = router;
