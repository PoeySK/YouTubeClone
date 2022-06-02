import React, { useEffect, useState } from 'react'
import Axios from 'axios'
function SideVideo() {
    const [sideVideos, setSideVideos] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.videos)
                    setSideVideos(response.data.videos)
                } else {
                    alert("비디오 가져오기 실패")
                }
            })
    }, [])

    const renderSideVideo = sideVideos.map((video) => {
        let minutes = Math.floor(video.duration / 60);
        let seconds = Math.floor(video.duration - minutes * 60);
        return (
            <div style={{ display: 'flex', marginBottom: "1rem", padding: "0 2rem" }} key={video._id}>
                <div style={{ width: '40%', marginRight: "1rem" }}>
                    <a href={`/video/${video._id}`}>
                        <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                    </a>
                </div>

                <div style={{ width: '50%' }}>
                    <a href={`/video/${video._id}`} style={{color: 'gray'}}>
                        <span style={{ frontSize: '1rem', color: 'black' }}>{video.title}</span><br />
                        <span>{video.writer.name}</span><br />
                        <span>{video.views} views</span><br />
                        <span>{minutes} : {seconds}</span><br />
                    </a>
                </div>
            </div>
        )
    })

    return (
        <React.Fragment>
            <div style={{marginTop: "3rem"}}></div>
            {renderSideVideo}
        </React.Fragment>

    )
}

export default SideVideo