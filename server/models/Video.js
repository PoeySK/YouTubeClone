const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId, // Id로만으로 /model/User.js 에서 userSchema의 값을 불러올 수 있음.
        ref: 'User',
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true }); // 만든 date와 업데이트 date을 표시함.

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };