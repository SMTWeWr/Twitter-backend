import express from "express";
import {TagsModel} from "../models/TagsModel";

class TagsController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const tags = await TagsModel.find({}).exec()
            res.json({
                status: 'success',
                data: tags
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
}

export const TagsCtrl = new TagsController()