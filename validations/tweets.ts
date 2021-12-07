import { body } from 'express-validator';

export const tweetValidations = [
    body('text', 'Введите текст твита')
        .isString()
        .isLength({
            max: 200,
        })
        .withMessage('Максимальная длина твита 200 символов'),
];
