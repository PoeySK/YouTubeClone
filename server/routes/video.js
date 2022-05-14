const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");
const multer = require("multer");

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

module.exports = router;
