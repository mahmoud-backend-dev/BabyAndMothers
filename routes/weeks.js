const express = require("express");
const router = new express.Router();
const weeksController = require("../controller/weeks-Controller");
const cors = require("cors");

router.use(
    cors({
        origin: "*",
    })
);

router.post("/add/week", weeksController.addWeek);

router.get("/search/:key", weeksController.readWeek);

router.patch("/update/:id", weeksController.updateWeek);

router.delete("/delete/:id", weeksController.deleteWeek);

router.post("/upload/img");

module.exports = router;
