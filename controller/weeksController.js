const Week = require("../models/Weeks");
const asyncHandler = require("express-async-handler");
const { BadRequest, NotFoundError } = require("../errors");

exports.addWeek = asyncHandler(async (req, res) => {
    const week = new Week(req.body);
    await week.save();
    res.status(201).send(week);
});

exports.readWeek = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    const week = await Week.findById(_id);
    if (!week) {
        throw new NotFoundError("Week Not Found!");
    }
    res.send(week);
});

exports.updateWeek = asyncHandler(async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "week", "headline", "content"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        throw new BadRequest("Invalid Updates!");
    }
    const week = await Week.findOne({
        _id: req.params.id,
    });
    updates.forEach((update) => (week[update] = req.body[update]));
    await week.save();

    if (!week) {
        throw new NotFoundError("Week Not Found!");
    }
    res.send(week);
});

exports.deleteWeek = asyncHandler(async (req, res) => {
    const week = await Week.findByIdAndDelete(req.params.id);
    if (!week) {
        throw new NotFoundError("Invalid Updates!");
    }
    res.send("Week deleted....");
});
