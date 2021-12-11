import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'


function Chat({socket, username, room}) {
    const [currentMessage,setCurrentMessage] = useState('')
    const [messageList,setMessageList] = useState([])


    const sendMessage = async () => {
        if(currentMessage){
            const messageData = {
                room,
                author:username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
            }
        setMessageList( (list) => [...list,messageData])
        await socket.emit('send_message',messageData)
        setCurrentMessage('')
        }
    }


    useEffect(()=>{
        socket.on('recieve_message',(data) => {
            console.log(data)
            setMessageList( (list) => [...list,data])
        })
    },[socket])

    return(<>
        <div>
            <div className="chat-window">
            <div className='chat-header'>
                <p>Live chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className='message-container'>
                {
                    messageList.map(
                        (messageContent)=>{
                                return (<>
                                <div className="message"  id={username === messageContent.author? 'you' : 'other'}>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id='time'>{messageContent.time}</p>
                                        <p id='author'>{messageContent.author}</p>
                                    </div>
                                    </div>
                                </>)

                                // return <h1>{messageContent.message}</h1>
                        }
                    )
                }
                </ScrollToBottom  >
            </div>
            <div className="chat-footer">
                <input type='text' 
                value={currentMessage}
                placeholder='Hey ...' 
                onChange={(e) => {setCurrentMessage(e.target.value)}}
                 onKeyPress={(e)=> { if (e.key === 'Enter'){
                    sendMessage()}}}/>
                <button onClick={sendMessage}>&#9658;</button>
            </div>
            </div>
        </div>    
    </>)
}

export default Chat;