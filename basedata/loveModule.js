const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loveSchema = new Schema({
    loveId: Number,
    time: Number,
    title: String,
    taName: String,
    yourName: String,
    anonymous: Boolean,
    gender: Boolean,
    section: String,
    img: Array,
    school: String,
    good: Number,
    avatar: String,
    comment: [{
        content: String,
        date: String
    }]
});

module.exports = mongoose.model('love', loveSchema, 'love');