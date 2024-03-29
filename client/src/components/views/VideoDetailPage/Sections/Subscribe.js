import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        let variable = { userTo: props.userTo }
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못하였습니다.')
                }
            })
        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userId') // Application -> localStorage 에 저장되어 있는 key인 userId의 value를 가져옴.
        }
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert("정보를 받아오지 못했습니다.")
                }
            })
    }, [])

    const onSubscribe = () => {
        let subscribedVariables = {
            userTo: props.userTo,
            userFrom: props.userFrom // VideoDetailPage에서 localStorage의 값을 가져와줌.
        }

        if (Subscribed) { // 이미 구독중
            Axios.post('/api/subscribe/unSubscribe', subscribedVariables)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert("구독 취소 하는데 실패 하였습니다.")
                    }
                })
        } else { // 구독 상태가 아님
            Axios.post('/api/subscribe/subscribe', subscribedVariables)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert("구독 하는데 실패 하였습니다.")
                    }
                })

        }
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                    borderRadius: '4px', color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe