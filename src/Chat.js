import { Avatar } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import './Chat.css'
import { IconButton } from '@material-ui/core'
import SearchOutlined from '@material-ui/icons/SearchOutlined'
import AttachFile from '@material-ui/icons/AttachFile'
import MoreVert from '@material-ui/icons/MoreVert'
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import db from './firebase'
import { useStateValue } from "./StateProvider";
import firebase from 'firebase'

function Chat() {

    const [input, setInput] = useState('');
    const { groupId, chatId } = useParams();
    const [groupName, setGroupName] = useState('');
    const [groupIcon, setGroupIcon] = useState('');
    const [messages, setMessages] = useState([]);
    const [{ user }, dispatch] = useStateValue();
    const [chatUserId, setChatUserId] = useState(chatId);

    useEffect(() => {
        console.log(groupId, chatId, 'setid', chatUserId)
        if (groupId) {
            db.collection('userDetails')
                .doc(groupId)
                .onSnapshot(snapshot => {
                    console.log(snapshot.data())
                    setGroupName(snapshot.data().displayName)
                    setGroupIcon(snapshot.data().photoURL)
                    setChatUserId(chatId)
                })

            if (chatUserId !== 'undefined') {
                console.log('chatId',chatId)
                setChatUserId(chatId)
                console.log('chatId found', typeof chatUserId)
                console.log('chatId found', groupId)
            }
            else {
                console.log('chatId not found', typeof chatUserId)
            }
        }
    }, [groupId])

    useEffect(() => {
            console.log('inside get message', chatUserId)
            db.collection('userChatings')
                .doc(chatUserId)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => setMessages(snapshot.docs.map((doc) => doc.data())))
        
    }, [chatUserId])

    const sendMessage = (e) => {
        e.preventDefault()
        console.log('youtyped', input)
        if (chatUserId !== 'undefined') {
            console.log('got chatId')
            db.collection("userChatings")
                .doc(chatUserId)
                .collection("messages")
                .add({
                    userEmail: user.email,
                    message: input,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })
        }
        else {

            db.collection('userDetails')
                .doc(groupId)
                .collection('chats').doc(user.email).set({
                    chatUser: user.email,
                    chatId: user.email + groupId
                })
                .then(() => db.collection('userDetails')
                    .doc(user.email)
                    .collection('chats').doc(groupId).set({
                        chatUser: groupId,
                        chatId: user.email + groupId
                    })
                ).then(() => db.collection("userChatings")
                    .doc(user.email + groupId)
                    .collection("messages")
                    .add({
                        userEmail: user.email,
                        message: input,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })

                ).then(() => {
                    setChatUserId(user.email + groupId)
                    console.log('new chatid is to be created', user.email + groupId, chatUserId, chatId)

                })


        }
        setInput('')
    }
    return (
        <div className='chat' >
            <div className='chat__header' >
                <Avatar
                    src={groupIcon} />
                <div className='chat__headerInfo' >
                    <h3>{groupName}</h3>
                    <p>Last seen...</p>
                </div>
                <div className='chat__headerRight' >
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className='chat__body' >
                {messages.map((message) => (
                    <p className={`chat__message ${message.userEmail === user.email
                        && "chat__reciever"}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                ))}
            </div>
            <div className='chat__footer' >
                <InsertEmoticonIcon />
                <form
                    onSubmit={sendMessage}
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                        type="text"
                    />
                    <button
                        onClick={sendMessage}
                        type="submit">
                        Send a message
          </button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
