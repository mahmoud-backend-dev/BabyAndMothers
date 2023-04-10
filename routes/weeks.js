const express = require("express");
const router = new express.Router();
const weeksController = require("../controller/weeksController");
router.post("/add/week", weeksController.addWeek);

router.get("/search/:id", weeksController.readWeek);

router.patch("/update/:id", weeksController.updateWeek);

router.delete("/delete/:id", weeksController.deleteWeek);

module.exports = router;
