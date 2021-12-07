import { body } from 'express-validator'

export const registerValidations = [
    body('email', 'Введите email').isEmail()
        .withMessage('Неверный email').isLength({min: 8, max: 40})
        .withMessage('Кол-во символов от 8 до 40'),
    body('fullname', 'Введите имя').isString()
        .isLength({min: 2, max: 40})
        .withMessage('Кол-во символов от 2 до 40'),
    body('username', 'Укажите логин').isString()
        .isLength({min: 2, max: 40})
        .withMessage('Кол-во символов от 2 до 40'),
    body('password', 'Укажите пароль').isString()
        .isLength({min: 6})
        .withMessage('Пароль слишком короткий(от 6 символов)')
        .custom((value, {req}) => {
            if (value !== req.body.rePassword) {
                throw new Error('Пароли не совпадают')
            } else {
                return value
            }
        }),
]