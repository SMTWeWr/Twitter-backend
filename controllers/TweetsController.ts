import express from "express";
import {UserModelType} from "../models/UserModel";
import mongoose from "mongoose";
import {TweetModel} from "../models/TweetModel";
import {validationResult} from "express-validator";


const isValidObjId = mongoose.Types.ObjectId.isValid

class TweetsController {
    async index(_: express.Request, res: express.Response): Promise<void> {
        try {
            const tweets = await TweetModel.find({}).populate('user').sort({'createdAt': '-1'}).exec()

            res.json({
                status: 'success',
                data: tweets
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweetId = req.params.id

            if (!isValidObjId(tweetId)) {
                res.status(400).send()
                return
            }

            const tweet = await TweetModel.findById(tweetId).populate('user').exec()
            if (!tweet) {
                res.status(404).send()
                return
            }

            res.json({
                status: 'success',
                data: tweet
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async delete(req: express.Request, res: express.Response): Promise<void> {
        const user = req.user as UserModelType
        try {
            if (user) {
                const tweetId = req.params.id

                if (!isValidObjId(tweetId)) {
                    res.status(400).send()
                    return
                }

                const tweet = await TweetModel.findById(tweetId)


                if (tweet && String(tweet.user._id) === String(user._id)) {
                    tweet.remove()
                    res.send()
                } else {
                    res.status(403).send()
                }
            } else res.status(404).send()
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelType
            const errors = validationResult(req)
            if (!user || !errors.isEmpty()) {
                res.status(400).json({status: 'error', message: errors.array()})
                return
            }

            const data = {
                text: req.body.text as string,
                images: req.body.images as string[],
                user: user._id,
            }
            const tweet = await TweetModel.create(data)

            if (user.tweets) {
                user.tweets.push(tweet._id)
            }


            res.json({
                status: 'success',
                data: await tweet.populate('user').execPopulate()
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async update(req: express.Request, res: express.Response): Promise<void> {
        const user = req.user as UserModelType
        try {
            if (user) {
                const tweetId = req.params.id

                if (!isValidObjId(tweetId)) {
                    res.status(400).send()
                    return
                }

                const tweet = await TweetModel.findById(tweetId)

                if (tweet && String(tweet.user._id) === String(user._id)) {
                    tweet.text = req.body.text
                    tweet.save()
                    res.send()
                } else {
                    res.status(403).send()
                }
            } else res.status(404).send()
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async getUserTweets(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id

            if (!isValidObjId(userId)) {
                res.status(400).send()
                return
            }
            if (!userId) return
            // @ts-ignore
            const tweet = await TweetModel.find({user: userId}).populate('user').exec()
            if (!tweet) {
                res.status(404).send()
                return
            }

            res.json({
                status: 'success',
                data: tweet
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }


}


export const TweetCtrl = new TweetsController()