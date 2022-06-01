import React, { useEffect, useState } from 'react';
import {Row, Col, List, Avatar} from 'antd';
import Axios from 'axios';

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId // App.js에서 Route에서 path중 :videoId를 써놔서 id값을 가져올 수 있음.
    const variable = {videoId: videoId}

    const [VideoDetail, setVideoDetail] = useState([]);

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert("비디오 정보 가져오기에 실패하였습니다.")
                }
            })
    }, [])
    if(VideoDetail.writer) {    
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{width:'100%', padding: '3rem 4rem'}}>
                        <video style={{width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                // writer로 가능한 이유: /routes/video.js 에서 populate을 이용하여 writer의 정보를 모두 가져옴
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            >
                            </List.Item.Meta>

                        </List.Item>

                    </div>
                </Col>
                <Col lg={6} xs={24}>

                </Col>
            </Row>
        )
    } else {
        return (
            <div>loading...</div>
        )
    }
}

export default VideoDetailPage;