import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardSubtitle, Col, Container, Row } from 'reactstrap';
import Moment from 'moment';
import firebase from '../../Firebase';
import ScrollToBottom from 'react-scroll-to-bottom';

import styles from './ChatRoom.module.scss';
import FormSendMessage from '../FormSendMessage/FormSendMessage';

function ChatRoom() {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [nickName, setNickName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [newChat, setNewChat] = useState({
        roomName: '',
        nickName: '',
        message: '',
        date: '',
        type: '',
    });
    const history = useHistory();
    const { room } = useParams();

    useEffect(() => {
        const fetchData = () => {
            setNickName(localStorage.getItem('nickName'));
            setRoomName(room);
            firebase
                .database()
                .ref('chats/')
                .orderByChild('roomName')
                .equalTo(roomName)
                .on('value', (resp) => {
                    setChats([]);
                    setChats(snapshotToArray(resp));
                });
        };

        fetchData();
    }, [room, roomName]);

    const snapshotToArray = (snapshot) => {
        const resultArr = [];
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            item.key = childSnapshot.key;
            resultArr.push(item);
        });

        return resultArr;
    };

    const submitMessage = (e) => {
        e.preventDefault();

        let chat = newChat;
        chat = {
            roomName,
            nickName,
            message: newChat.message,
            date: Moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
            type: 'message',
        };

        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat).then();
        setNewChat({ roomName: '', nickName: '', message: '', date: '', type: '' });
    };

    const onChange = (e) => {
        console.log(e.target.value);
        e.persist();
        setNewChat({ ...newChat, [e.target.name]: e.target.value });
    };

    const exitChat = (e) => {
        const chat = {
            roomName,
            nickName,
            date: Moment(new Date()).format('DD/MM/YYYY HH:ss:mm'),
            message: `${nickName} leave the room`,
            type: 'exit',
        };

        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat).then();
        history.goBack();
    };

    return (
        <div className={styles.Container}>
            <Container>
                <Row>
                    <Col xs="4">
                        <div>
                            <Card className={styles.UsersCard}>
                                <CardBody>
                                    <CardSubtitle>
                                        <Button
                                            variant="primary"
                                            type="button"
                                            onClick={() => {
                                                exitChat();
                                            }}
                                        >
                                            Exit Chat
                                        </Button>
                                    </CardSubtitle>
                                </CardBody>
                            </Card>
                            {users.map((item, idx) => (
                                <Card key={idx} className={styles.UsersCard}>
                                    <CardSubtitle>{item.nickName}</CardSubtitle>
                                </Card>
                            ))}
                        </div>
                    </Col>

                    <Col xs="8">
                        <ScrollToBottom className={styles.ChatContent}>
                            {chats.map((item, idx) => (
                                <div key={idx} className={styles.MessageBox}>
                                    {item.type === 'join' || item.type === 'exit' ? (
                                        <div className={styles.ChatStatus}>
                                            <span className={styles.ChatDate}>{item.date}</span>
                                            <span className={styles.ChatContentCenter}>{item.message}</span>
                                        </div>
                                    ) : (
                                        <div className={styles.ChatMessage}>
                                            <div
                                                className={`${
                                                    item.nickName === nickName ? styles.RightBubble : styles.LeftBubble
                                                }`}
                                            >
                                                {item.nickName === nickName ? (
                                                    <span className={styles.MsgName}>Me</span>
                                                ) : (
                                                    <span className={styles.MsgName}>{item.nickName}</span>
                                                )}
                                                <span className={styles.MsgDate}> at {item.date}</span>
                                                <p>{item.message}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </ScrollToBottom>
                        <footer className={styles.StickyFooter}>
                            <FormSendMessage
                                submitMessage={submitMessage}
                                onChange={onChange}
                                message={newChat.message}
                            />
                        </footer>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

ChatRoom.propTypes = {};

ChatRoom.defaultProps = {};

export default ChatRoom;
