import {model, Schema, Document} from "mongoose";


export type TagsModelType = {
    _id?: string
    name: string
    count: string
}

export type TagsModelDocumentType = TagsModelType & Document;

const TagsSchema = new Schema<TagsModelType>({
    name: {
        required: true,
        type: String,
    },
    count: {
        required: true,
        type: String,
    },

});

export const TagsModel = model<TagsModelDocumentType>('Tags', TagsSchema);
