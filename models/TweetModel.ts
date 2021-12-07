import {model, Schema, Document} from 'mongoose';
import {UserModelDocumentType} from "./UserModel";

export type TweetModelType = {
    _id?: string
    text: string
    user: UserModelDocumentType
    images?: string[]
}

export type TweetModelDocumentType = TweetModelType & Document;

const TweetSchema = new Schema<TweetModelType>({
    text: {
        required: true,
        type: String,
        maxlength: 200,
    },
    user: {
        required: true,
        ref: 'User',
        type: Schema.Types.ObjectId,
    },
    images: [
        {
            type: String,
        }
    ],
}, {
    timestamps: true
});

export const TweetModel = model<TweetModelDocumentType>('Tweet', TweetSchema);
