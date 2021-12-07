import express from "express";
import {UserModel, UserModelDocumentType, UserModelType} from "../models/UserModel";
import {validationResult} from "express-validator";
import {generateMD5} from "../utils/generateHash";
import {sendEmail} from "../utils/sendEmail";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';


const isValidObjId = mongoose.Types.ObjectId.isValid

const createToken = (data: UserModelDocumentType) => {
    return jwt.sign({data: data}, process.env.SECRET_KEY || '9t5', {
        expiresIn: '30 days',
    })
}

class UserController {

    async index(_: any, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({}).exec()

            res.json({
                status: 'success',
                data: users
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({status: 'error', message: errors.array()})
                return
            }

            const randomStr = Math.random().toString()

            const data: UserModelType = {
                email: req.body.email,
                fullname: req.body.fullname,
                username: req.body.username,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirmHash: generateMD5(process.env.SECRET_KEY + randomStr || randomStr)
            }

            const user = await UserModel.create(data)

            const userData = user ? (user as UserModelDocumentType).toJSON() : undefined;

            const token = createToken(user)

            sendEmail(
                {
                    emailFrom: 'Support <petprojectsupp@gmail.com>',
                    emailTo: data.email,
                    subject: 'Подтверждение почты Twitter Clone',
                    html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:${
                        process.env.PORT || 8888
                    }/users/verify?hash=${data.confirmHash}">по этой ссылке</a>`,
                },
                (err: Error | null) => {
                    if (err) {
                        res.status(500).json({
                            status: 'error',
                            message: 'Send email Error',
                        });
                    } else {
                        res.status(201).json({
                            status: 'success',
                            data: {...userData, token},
                        });
                    }
                },
            )
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async verify(req: express.Request, res: express.Response): Promise<void> {
        try {
            const hash = req.query.hash

            if (!hash) {
                res.status(400).send()
                return
            }


            const user = await UserModel.findOne({confirmHash: hash as string}).exec()

            if (user) {
                user.confirmed = true
                await user.save()
                res.json({
                    status: 'success'
                })
            } else {
                res.status(404).send({
                    status: 'error',
                    message: 'Пользователь не найден'
                })
            }


        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id

            if (!isValidObjId(userId)) {
                res.status(400).send()
                return
            }

            const user = await UserModel.findById(userId).populate('Tweets').exec()
            if (!user) {
                res.status(404).send()
                return
            }

            res.json({
                status: 'success',
                data: user
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    async afterLogin(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user ? (req.user as UserModelDocumentType).toJSON() : undefined;

            // Uncomment if you want to check, if the email was confirmed
            // if (user && user.confirmed === false) {
            //     res.status(404).send({
            //         status: 404,
            //         message: 'подтвердите почту'
            //     })
            //     return
            // }

            res.json({
                status: 'success',
                data: {
                    ...user,
                    token: createToken(req.user as UserModelDocumentType)
                },
            });

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            });
        }
    }

    async getUserInfo(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user ? (req.user as UserModelDocumentType).toJSON() : undefined;
            res.json({
                status: 'success',
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            });
        }
    }
}

export const UserCtrl = new UserController()


