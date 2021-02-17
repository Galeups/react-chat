import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Jumbotron, Spinner, ListGroup, ListGroupItem, Button } from 'reactstrap';
import Moment from 'moment';
import firebase from '../../Firebase';

import styles from './RoomList.module.scss';

const RoomList = () => {
    const [room, setRoom] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [nickName, setNickName] = useState('');
    const history = useHistory();
    const rooms = firebase.database().ref('rooms/');
    const chats = firebase.database().ref('chats/');
    const roomusers = firebase.database().ref('roomusers/');

    useEffect(() => {
        const fetchData = async () => {
            setNickName(localStorage.getItem('nickName'));
            rooms.on('value', (resp) => {
                setRoom([]);
                setRoom(snapshotToArray(resp));
                setShowLoading(false);
            });
        };

        fetchData().then();
    });

    const snapshotToArray = (snapshot) => {
        const returnArr = [];

        snapshot.forEach((childSnap) => {
            console.log(childSnap);

            const item = childSnap.val();
            item.key = childSnap.key;
            returnArr.push(item);
        });

        return returnArr;
    };

    const enterChatRoom = (roomName) => {
        const chat = {
            roomName,
            nickName,
            message: `${nickName} enter the room`,
            date: Moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
            type: 'join',
        };

        const newMessage = chats.push(chat);
        newMessage.set(chat).then();

        roomusers
            .orderByChild('roomname')
            .equalTo(roomName)
            .on('value', (resp) => {
                let roomUser = snapshotToArray(resp);
                const user = roomUser.find((x) => x.nickName === nickName);

                if (user !== undefined) {
                    const userRef = firebase.database().ref(`roomusers${user.key}`);
                    userRef.update({ status: 'online' });
                } else {
                    const newroomuser = {
                        roomName,
                        nickName,
                        status: 'online',
                    };

                    const newRoomUser = roomusers.push();
                    newRoomUser.set(newroomuser).then();

                    history.push(`/chatroom'${roomName}`);
                }
            });
    };

    const logOut = () => {
        localStorage.removeItem('nickName');
        history.push('/login');
    };

    return <div className={styles.RoomList}>RoomList Component</div>;
};

RoomList.propTypes = {};

RoomList.defaultProps = {};

export default RoomList;
