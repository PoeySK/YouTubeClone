const express = require('express');
const router = express.Router();
const multer = require("multer");
let ffmpeg = require("fluent-ffmpeg");
const { Video } = require('../models/Video');

let storage = multer.diskStorage({
    destination: (req, file, cb) => { // 파일 저장 위치 지정
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => { // 파일 이름 지정
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4') {
            return cb(res.status(400).end('mp4 파일만 업로드 할 수 있습니다.'), false);
        }
        cb(null, true);
    }
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
    // Video save on server
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    });
});

router.post('/uploadVideo', (req, res) => {
    // Video save on server
    const video = new Video(req.body)
    video.save((err, doc) => { // mongoDB method (mongoDB에 저장)
        if (err) {
            return res.json({ success: false, err })
        }
        res.status(200).json({ success: true })
    })

});

router.post('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와 클라이언트에 보낸다.
    Video.find() // video collection에 있는 모든 video를 가져옴
        .populate('writer')
        .exec((err, videos) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, videos })
        })
});

router.post('/thumbnail', (req, res) => {
    // 썸네일 생성 및 비디오 러닝타임 가져오기

    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.log(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })
    ffmpeg.setFfmpegPath("C:\\Users\\82103\\ffmpeg-5.0.1-full_build\\bin\\ffmpeg.exe");

    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log("Will genenrate " + filenames.join(', '));
            console.log(filenames);

            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            console.log("Screenshots taken");
            return res.json({
                success: true,
                url: filePath,
                fileDuration: fileDuration
            });
        })
        .on('error', function (err) {
            console.log(err);
            return res.json({
                success: false, err
            });
        })
        .screenshot({
            count: 3, // 썸네일의 개수
            folder: 'uploads/thumbnails', // 썸네일이 저장될 경로
            size: '320x240',
            filename: 'thumbnail-%b.png'
        });
})

module.exports = router;
