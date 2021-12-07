import express from "express";
import cloudinary from "../core/cloudinary"


class UploadFileController {
    async upload(req: express.Request, res: express.Response): Promise<void> {
        if (!req.file) return

        const file = req.file

        cloudinary.v2.uploader.upload_stream({resource_type: 'auto'}, (error, result) => {
            if (error || !result) {
                return res.status(500).json({
                    status: 'error',
                    message: error || 'upload error'
                })
            }
            res.status(201).json({
                url: result.url,
                size: result.bytes,
                height: result.height,
                width: result.width
            })
        }).end(file.buffer)

    }
}

export const UploadFileCtrl = new UploadFileController()