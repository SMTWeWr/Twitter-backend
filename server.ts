import dotenv from 'dotenv'
dotenv.config()

import {passport} from "./core/passport";
import express from 'express'
import {UserCtrl} from "./controllers/UserController";
import {TweetCtrl} from "./controllers/TweetsController";
import {registerValidations} from "./validations/register";
import {tweetValidations} from "./validations/tweets";
import {TagsCtrl} from "./controllers/TagsController";
import {UploadFileCtrl} from "./controllers/UploadFileController";

import './core/db'
import cors from 'cors'

const multer = require("multer");

const app = express()
const storage = multer.memoryStorage()
const upload = multer({storage})


app.use(express.json())
app.use(passport.initialize())

const options = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
}

app.use(cors(options))


app.get('/users', UserCtrl.index)
app.get('/users/me', passport.authenticate('jwt', {session: false}), UserCtrl.getUserInfo);
app.get('/users/:id', UserCtrl.show);

app.get('/tweets', TweetCtrl.index)
app.get('/tweets/:id', TweetCtrl.show)
app.get('/tweets/user/:id', TweetCtrl.getUserTweets)
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetCtrl.delete)
app.patch('/tweets/:id', passport.authenticate('jwt'), tweetValidations, TweetCtrl.update)
app.post('/tweets', passport.authenticate('jwt'), tweetValidations, TweetCtrl.create)


app.get('/auth/verify', registerValidations, UserCtrl.verify)
app.post('/auth/signup', registerValidations, UserCtrl.create)
app.post('/auth/signin', passport.authenticate('local'), UserCtrl.afterLogin)

app.get('/themes', TagsCtrl.index)

app.post('/upload', upload.single('image'), UploadFileCtrl.upload)


app.listen(process.env.PORT || 8888, () => {
    console.log('Server running')
})