import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Jumbotron, ListGroup, ListGroupItem, Spinner } from 'reactstrap';
import Moment from 'moment';
import firebase from '../../Firebase';

import styles from './RoomList.module.scss';

const RoomList = () => {
    const [room, setRoom] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [nickName, setNickName] = useState('');
    const history = useHistory();
    const chats = firebase.database().ref('chats/');
    const roomUsers = firebase.database().ref('roomUsers/');

    useEffect(() => {
        let destroy = false;
        setNickName(localStorage.getItem('nickName'));
        firebase
            .database()
            .ref('rooms/')
            .on('value', (resp) => {
                if (!destroy) {
                    setRoom([]);
                    setRoom(snapshotToArray(resp));
                    setShowLoading(false);
                }
            });

        return () => {
            destroy = true;
        };
    }, []);

    const snapshotToArray = (snapshot) => {
        const returnArr = [];

        snapshot.forEach((childSnap) => {
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

        roomUsers
            .orderByChild('roomName')
            .equalTo(roomName)
            .on('value', (resp) => {
                let roomUser = snapshotToArray(resp);
                const user = roomUser.find((x) => x.nickName === nickName);

                if (user !== undefined) {
                    const userRef = firebase.database().ref(`roomUsers${user.key}`);
                    userRef.update({ status: 'online' }).then();
                } else {
                    const newroomuser = {
                        roomName,
                        nickName,
                        status: 'online',
                    };

                    const newRoomUser = roomUsers.push();
                    newRoomUser.set(newroomuser).then();
                }

                history.push(`/chatroom/${roomName}`);
            });
    };

    const logout = () => {
        localStorage.removeItem('nickName');
        history.push('/login');
    };

    return (
        <div className={styles.roomList}>
            {showLoading && <Spinner color="primary" />}
            <Jumbotron>
                <h3>
                    {nickName}{' '}
                    <Button
                        onClick={() => {
                            logout();
                        }}
                    >
                        Logout
                    </Button>
                </h3>

                <h2>Room list</h2>
                <div>
                    <Link to="/add-room">Add room</Link>
                </div>

                <ListGroup>
                    {room.map((item, idx) => (
                        <ListGroupItem
                            key={idx}
                            action
                            onClick={() => {
                                enterChatRoom(item.roomName);
                            }}
                        >
                            {item.roomName}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Jumbotron>
        </div>
    );
};

RoomList.propTypes = {};

RoomList.defaultProps = {};

export default RoomList;
