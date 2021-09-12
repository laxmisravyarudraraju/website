const apiFeatures = require('./apiFeatures');

exports.findAllHandler = (mod, ...popOptions) => async (req, res, next) => {
    let query = apiFeatures(req.query, mod).select('-__v').sort('-createdAt');
    if (popOptions)
        popOptions.forEach(el => {
            query = query.populate(el);
        })
    const data = await query;
    res.status(200).json({
        "status": "success",
        data
    });
}

exports.findOneHandler = (mod, ...popOptions) => async (req, res) => {
    let query = mod.findById(req.params.id);
    if (popOptions)
        popOptions.forEach(el => {
            query = query.populate(el);
        })
    const data = await query;
    res.status(200).json({
        "status": "success",
        data
    });
}

exports.updateHandler = mod => async (req, res) => {
    const data = await mod.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.status(201).json({
        "status": "success",
        data
    });
}

exports.createHandler = mod => async (req, res, next) => {
    const data = await mod.create(req.body);
    res.status(201).json({
        status: "success",
        data
    })
}

exports.deleteHandler = mod => async (req, res, next) => {
    await mod.findByIdAndDelete(req.params.id);
    res.status(204).json({
        "status": "success"
    })
}