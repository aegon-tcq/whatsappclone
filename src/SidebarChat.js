import React, { useState } from 'react'
import { Avatar } from '@material-ui/core'
import './SidebarChat.css'
import db from './firebase'
import { Link } from 'react-router-dom'

function SidebarChat({ id, name, iconUrl, lastMessage, addNewChat,chatId }) {

    const [seed, setSeed] = useState("");
    console.log('sidebarchat',id, name, iconUrl, lastMessage, addNewChat,chatId )
    const createChat = () => {

        const groupName = prompt('Enter new group name')

        if (groupName) {
            
            setSeed(Math.floor(Math.random() * 5000));

            db.collection('groups').add({
                name: groupName,
                iconUrl: `https://avatars.dicebear.com/api/human/${seed}.svg`
            })
        }
    }

    return !addNewChat ? (
        <Link to={`/groups/${id}/${chatId}`}>
            <div className='sidebarChat' >
                <Avatar
                    src={iconUrl}
                />
                <div className='sidebarChat__info' >
                    <h2>{name}</h2>
                    <p>{lastMessage}</p>
                </div>

            </div>
        </Link>
    ) :
        (
            <div
                onClick={createChat}
                className='sidebarChat' >
                <h2>Add New Chat</h2>
            </div>
        )
}

export default SidebarChat
