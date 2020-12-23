const express = require('express');
const db = require('../basedata/db');
const loveModule = require('../basedata/loveModule');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const form = formidable({ multiples: true, keepExtensions:true, uploadDir:__dirname });


db.then(() => {

    router.post('/love', (req, res) => {
        let img = [];
        // form.on('file', (name, file)=>{
        //     // console.log(name, file);
        // });

        // form.on('field', (name,value)=>{
            
        // });

        // form.on('end', ()=>{

        // });

        // form.on('error', (err)=>{

        // });


        form.parse(req, (err, fields, file)=>{
            let img = [];
            console.log(file);
            for(let items in file){
                let newPath = path.join(__dirname, '../upload/');
                try{
                    fs.renameSync(file[items].path, newPath + fields.time+ file[items].name);
                }catch(e){
                    console.log(newPath + file[items].name);
                    throw Error(e);
                    res.json({
                        state: false
                    });
                }
                img.push('\\upload\\'+fields.time+ file[items].name);
            }

            fields.img = img;

            let resolve = loveModule.create(fields);
            resolve.then((doc) => {
                console.log(doc);
                res.json({
                    state: true
                });
            }).catch((err) => {
                console.log(err);
                res.json({
                    state: false
                });
            });
        });
        // console.log(req.body.time);
        // let resolve = loveModule.create(req.body);
        // resolve.then((doc) => {
        //     console.log(doc);
        //     res.json({
        //         state: true
        //     });
        // }).catch((err) => {
        //     console.log(err);
        //     res.json({
        //         state: false
        //     });
        // });
    });

    router.post('/image', (req, res) => {
        console.log(req.ip);
        let form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '../upload');

        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log('文件上传失败');
                return;
            }
            let oldpath = files.image.path;
            let newpath = path.join(__dirname, '../public/Image/');
            let { ext } = path.parse(oldpath);
            let times = Date.now();
            fs.rename(oldpath, newpath + times + ext, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('重命名成功');
                    res.json({ url: '/Image/' + times + ext });
                }
            });
        });
    });

    router.post('/home', (req, res) => {
        let { count } = req.body;
        loveModule.find({}).skip(count).limit(10).sort({ time: -1 }).exec((err, data) => {
            if (err) {
                return console.log('60行出错' + err);
            }
            if (data) {
                res.json(data);
            }
        });
    });


    router.post('/star', (req, res) => {
        let { state, loveId } = req.body;
        console.log(state, loveId);
        if (state) {
            loveModule.updateOne({ loveId: loveId }, { $inc: { good: 1 } }, (err, doc) => {
                if (err) {
                    console.log('76行报错' + err);
                    return;
                }
                res.json({ state: true });
            });
        } else {
            loveModule.updateOne({ loveId: loveId }, { $inc: { good: -1 } }, (err, doc) => {
                if (err) {
                    console.log('84行报错' + err);
                    return;
                }
                res.json({ state: true });
            });
        }
    });


    router.post('/search', (req, res) => {
        let { search } = req.body;
        console.log(search);
        let reg = new RegExp(search, 'm');
        loveModule.find({
                $or: [
                    { section: { $regex: reg } },
                    { title: { $regex: reg } }
                ]
            },
            (err, data) => {
                if (err) {
                    return console.log(err);
                }
                if (data) {
                    console.log(data);
                    res.json(data);
                }
            });
    });

    router.post('/sort', (req, res) => {
        let { flag } = req.body;
        switch (flag) {
            case 'recommend':
                loveModule.find({}).sort({ good: -1 }).exec((err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    res.json(data);
                });
                break;
            case 'anonymous':
                loveModule.find({
                    anonymous: true
                }, (err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    res.json(data);
                });
                break;
            case 'man':
                loveModule.find({
                    gender: true
                }, (err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    res.json(data);
                });
                break;
            case 'girl':
                loveModule.find({
                    gender: false
                }, (err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    res.json(data);
                });
                break;
        }
    });

    router.get('/content/:id', (req, res) => {
        let { id } = req.params;
        loveModule.findOne({ loveId: id }, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            if (data) {
                let comment = [];
                for (let x of data.comment) {
                    let temp = { content: x.content, date: x.date };
                    comment.push(temp);
                }
                res.render('content.html', {
                    loveId: data.loveId,
                    time: data.time,
                    title: data.title,
                    taName: data.taName,
                    yourName: data.yourName,
                    anonymous: data.anonymous,
                    gender: data.gender,
                    section: data.section,
                    img: data.img,
                    school: data.school,
                    good: data.good,
                    avatar: data.avatar,
                    comment: comment,
                });
            }
        });
    });

    router.post('/comment', (req, res) => {
        let { comment, loveId, time } = req.body;
        loveModule.updateOne({ loveId: loveId }, { $push: { comment: { content: comment, date: time } } },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    res.json({ state: false });
                    return;
                }
                res.json({ state: true });
            });
    });

}).catch((err) => {
    if (err) {
        console.log('数据库连接失败');
    }
});




module.exports = router;