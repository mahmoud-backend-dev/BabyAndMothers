const Week = require("../models/weeks-model");

exports.addWeek = async (req, res) => {
    const week = new Week(req.body);

    try {
        await week.save();
        res.status(201).send(week);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.readWeek = async (req, res) => {
    const week = await Week.find({
        $or: [{ weekNumber: { $regex: req.params.key } }],
    });
    res.send(week);
};

exports.updateWeek = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "title",
        "week",
        "weekNumber",
        "headline",
        "content",
    ];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const week = await Week.findOne({
            _id: req.params.id,
        });

        updates.forEach((update) => (week[update] = req.body[update]));
        await week.save();

        if (!week) {
            return res.status(404).send();
        }

        res.send(week);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.deleteWeek = async (req, res) => {
    try {
        const week = await Week.findByIdAndDelete(req.params.id);

        if (!week) {
            return res.status(404).send();
        }

        res.send("Week deleted....");
    } catch (e) {
        res.status(500).send(e);
    }
};
