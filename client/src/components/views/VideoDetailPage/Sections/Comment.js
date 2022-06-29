import Axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function Comment(props) {
    const videoId = props.postId
    const user = useSelector(state => state.user)

    const [commentValue, setCommentValue] = useState("")

    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }
        console.log(variables)
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    console.log(response.data.result)
                } else {
                    alert('커멘트를 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p>REPLIES</p>
            <hr />

            {/* Comment Lists */}

            {/* Root COmment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="write some comments"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Sumbit</button>
            </form>
        </div>
    )
}

export default Comment