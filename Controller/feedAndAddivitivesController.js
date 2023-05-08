import mongoose from 'mongoose';
import FeedAndAddivitives from '../Models/feedAndAddivitives.js'
import Dairy from "../Models/cowSchema.js";
export const create = async (req, res ,next) => {
    try {
        const feedAndAddivitives = new FeedAndAddivitives(req.body);
        await feedAndAddivitives.save();
        return res.json(feedAndAddivitives);
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const dairyDB = await FeedAndAddivitives.findById(req.params.id);
        if (!dairyDB) return res.sendStatus(404);
        const dairyUpdate = await FeedAndAddivitives.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(dairyUpdate);
    } catch (err) {
        next(err)
    }
};

export const remove = async (req, res, next) => {
    try {
        const dairyDB = await FeedAndAddivitives.findById(req.params.id);
        if (!dairyDB) return res.sendStatus(404);
        await FeedAndAddivitives.findOneAndRemove({ _id: req.params.id })
        return res.sendStatus(204);
    } catch (err) {
        next(err)
    }
}

export const getOne = async (req, res, next) => {

    const currentDate = new Date();

    currentDate.setHours(3, 0, 0, 0);
    const nextDay = new Date();
    nextDay.setHours(3, 0, 0, 0);
    nextDay.setDate(nextDay.getDate() + 1)
    console.log('current date', currentDate.toISOString());
    console.log('next day', nextDay);
    const aggregate = await FeedAndAddivitives.aggregate([
        {
          $match: {
              _id: new mongoose.Types.ObjectId(req.params.id),
          }
        },
        {
            $lookup: {
                from: 'dairies',
                let: { feedAndAddivitives: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $and: [
                                {$expr: {$eq: ['$feedAndAddivitives', '$$feedAndAddivitives']}},
                                { createdAt: { $gte: currentDate } },
                                { createdAt: { $lte: nextDay } }
                            ]
                        },
                    }
                ],
                as: 'daires'
            }
        }
    ]);
    return res.json(aggregate)
}

export const getByExpression = async (req, res, next) => {
    const [ date ] = [
        req.query.date
    ];
    console.log('req query', req.query);
    console.log('date', date);
    const splitDate = date.split(';;');
    const aggregate = await FeedAndAddivitives.aggregate([
        {
            $lookup: {
                from: 'dairies',
                let: { feedAndAddivitives: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $and: [
                                {$expr: {$eq: ['$feedAndAddivitives', '$$feedAndAddivitives']}},
    { createdAt: { $gte: new Date(splitDate[0]) } },
    { createdAt: { $lte: new Date(splitDate[1]) } }
]
                        },
                    }
                ],
                as: 'daires'
            }
        }
    ]);
    return res.json(aggregate)
}