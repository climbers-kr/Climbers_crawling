require('dotenv').config();
const express=require('express');
const morgan=require('morgan');
const path=require('path');
const mongoose = require("mongoose");
import fileReadTest from './fileReadTest';

const { MONGO_URI }=process.env;
mongoose
    .connect(MONGO_URI, {useNewUrlParser: true, useFindAndModify: false})
    .then(()=>{
        console.log('Connected to MongoDB');
        fileReadTest();
    })
    .catch(e=>{
        console.error(e);
    });


const app=express();

app.set('port', process.env.PORT || 8001);
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use((req, res, next)=>{
    const err=new Error('Not Found');
    err.status=404;
    next(err);
});


app.use((err, req, res)=>{
    res.locals.message=err.message;
    res.locals.error=req.app.get('env')==='development' ? err: {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중');
});