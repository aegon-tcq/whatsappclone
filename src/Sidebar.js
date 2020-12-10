import { Avatar, IconButton } from '@material-ui/core'
import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import React, { useState, useEffect } from 'react'
import './Sidebar.css'
import SidebarChat from './SidebarChat'
import db from './firebase'
import { useStateValue } from "./StateProvider";
import ClearIcon from '@material-ui/icons/Clear';

function Sidebar() {

    const [{ user, allUserDetails }, dispatch] = useStateValue();
    const [input, setInput] = useState('');
    const [found, setFound] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        console.log('sidebar', user, allUserDetails)
        db.collection('userDetails')
            .doc(user.email)
            .collection('chats')
            .onSnapshot(snapshot => setChats(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }))))

    }, [])


    const searchUser = (e) => {
        setInput(e)
        if (e === '') {
            console.log('zero', e, chats)
            clear()
        }
        else {
            setFound((Object.keys(allUserDetails).map((allusers) => {
                if (allusers.includes(e) && (user.email !== allUserDetails[allusers].email)) {
                    let x = chats.find(function (u, i) {
                        if (u.id === allusers) return true
                        else return false
                    })
                    return (x ? null: allUserDetails[allusers] )
                } else {
                    return null
                }
            })).filter((data) => data != null))
        }
    }

    const clear = () => {
        console.log('called')
        setFound([])
        setInput('')
    }


    return (
        <div className='sidebar' >
            <div className='sidebar__header' >
                <div className='sidebar__header1'>
                    <Avatar src={user?.photoURL} />
                    <div className='sidebar__headerInfo' >
                        <h2>{user.displayName}</h2>
                        <p>{user.email}</p>
                    </div>
                </div>
                <div className='sidebar__headerRight' >
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className='sidebar__search' >
                <div className='sidebar__searchContainer' >
                    <SearchOutlinedIcon />
                    <input
                        value={input}
                        placeholder='Search people by email'
                        type='text'
                        onInput={(e) => searchUser(e.target.value)}
                        on
                    />
                    <IconButton>
                        <ClearIcon onClick={clear} />
                    </IconButton>

                </div>
            </div>
            <div className='sidebar__chat' >
                {/* <Render /> */}
                {found.map((data) => (
                    <SidebarChat
                        key={data.email}
                        id={data.email}
                        name={data.displayName}
                        iconUrl={data.photoURL}
                    />
                ))}
                {chats.length > 0 ? chats.map(chat => (
                    <SidebarChat
                        key={chat.data.chatUser}
                        id={chat.data.chatUser}
                        name={allUserDetails[chat.data.chatUser].displayName}
                        iconUrl={allUserDetails[chat.data.chatUser].photoURL}
                        chatId={chat.data.chatId}
                        lastMessage={chat.data.chatUser}
                    />
                )) : <div className='sidebar__noMessages'>
                    <p>No messages yet!</p>
                </div>}
            </div>
        </div>
    )
}

export default Sidebar
