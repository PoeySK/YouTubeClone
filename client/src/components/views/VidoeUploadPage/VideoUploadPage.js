import React, { useState } from 'react'
import { Typography, Button, Form, Input, Icon, message } from 'antd';
import DropZone from 'react-dropzone'
import Axios from 'axios';
import { useSelector } from 'react-redux'

const { TextArea } = Input;
const { Title } = Typography

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" },
];

const CategoryOptions = [
    { value: 0, label: "File & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage(props) {
    const user = useSelector(state => state.user); // redux state안에 있는 user의 정보를 가져옴.
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescriptions] = useState("");
    const [Private, setPrivate] = useState("");
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    };

    const onDescriptionChange = (e) => {
        setDescriptions(e.currentTarget.value);
    };

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value);
    };

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    };

    const onDrop = (file) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", file[0])

        console.log(file)

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) { // upload success
                    console.log(response.data);

                    let temp = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    };

                    setFilePath(response.data.url);

                    Axios.post('/api/video/thumbnail', temp)
                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration);
                                setThumbnailPath(response.data.url);
                                console.log(response.data)
                            } else {
                                alert('썸네일 생성 실패')
                            }
                        });
                } else { // upload fail
                    alert("Video Upload Fail");
                }
            })
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath,
        }

        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);

                    message.success('성공적으로 업로드를 했습니다.')

                    setTimeout(() => {
                        props.history.push('/')
                    }, 3000);
                } else {
                    alert('Video Upload Fail')
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* drop zone */}
                    <DropZone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={100000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{
                                width: '300px', height: '240px', border: '1px solid lightgray',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type='plus' style={{ fontSize: '3rem' }} />
                            </div>
                        )}

                    </DropZone>
                    {/* thumbnail */}
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>

                <br />
                <br />

                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />

                <br />
                <br />

                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />

                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />

                <Button type='primary' size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage;