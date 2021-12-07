import {model, Schema, Document} from "mongoose";


export type UserModelType = {
    _id?: string
    email: string
    fullname: string
    username: string
    password: string
    confirmHash: string
    confirmed?: boolean
    location?: string
    about?: string
    website?: string
    token?: string
    tweets?: string[]
}

export type UserModelDocumentType = UserModelType & Document;

const UserSchema = new Schema<UserModelType>({

    email: {
        unique: true,
        required: true,
        type: String,
    },
    fullname: {
        required: true,
        type: String,
    },
    username: {
        unique: true,
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    confirmHash: {
        required: true,
        type: String,

    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    location: String,
    about: String,
    website: String,
    tweets: [{type: Schema.Types.ObjectId, ref: 'Tweet'}]
}, {
    timestamps: true
});

UserSchema.set('toJSON', {
    transform: function (_, obj) {
        delete obj.password
        delete obj.confirmHash
        return obj
    }
})

export const UserModel = model<UserModelDocumentType>('User', UserSchema);
