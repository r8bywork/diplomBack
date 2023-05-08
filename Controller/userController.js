import User from "../Models/User.js";

export const update = async (req, res, next) => {
    try {
        const userDB = await User.findById(req.params.id);
        if (!userDB) return res.sendStatus(404);
        const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(userUpdate);
    } catch (err) {
        next(err)
    }
};