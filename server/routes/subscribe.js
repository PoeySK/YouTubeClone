const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const { Subscriber } = require('../models/Subscriber');

//=================================
//             Subscriber
//=================================

router.post('/subscribeNumber', (req, res) => {
    // 구독자 수 정보 받기
    Subscriber.find({ 'userTo': req.body.userTo })
        .exec((err, subscribe) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
        })
});

router.post('/subscribed', (req, res) => {
    // 현재 채널에서 나의 구독 상태 확인하기
    Subscriber.find({
        'userTo': req.body.userTo,
        'userFrom': req.body.userFrom
    })
        .exec((err, subscribe) => {
            if (err) {
                return res.status(400).send(err);
            }
            let result = false
            if (subscribe.length !== 0) {
                result = true
            }
            res.status(200).json({ success: true, subscribed: result })
        })

});

router.post('/unSubscribe', (req, res) => {
    // 이미 구독중인 상태에서 취소하기
    console.log(req.body)
    Subscriber.findOneAndDelete({
        userTo: req.body.userTo,
        userFrom: req.body.userFrom
    })
        .exec((err, doc) => {
            if (err) {
                return res.status(400).json({ success: false, err })
            }
            res.status(200).json({ success: true, doc })
        })
});

router.post('/subscribe', (req, res) => {
    // 구독이 되지 않은 상태에서 구독을 하기 위함
    const subscribe = new Subscriber(req.body) // 모든 userTo와 userFrom의 정보
    console.log(req.body)
    subscribe.save((err, doc) => {
        if (err) {
            return res.json({ success: false, err })
        }
        res.status(200).json({ success: true })
    })
});

module.exports = router;
