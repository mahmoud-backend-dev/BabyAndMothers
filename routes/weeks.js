const express = require("express");
const router = new express.Router();
const weeksController = require("../controller/weeks-Controller");


router.post("/add/week", weeksController.addWeek);

router.get("/search/:key", weeksController.readWeek);

router.patch("/update/:id", weeksController.updateWeek);

router.delete("/delete/:id", weeksController.deleteWeek);

router.post("/upload/img");

module.exports = router;
