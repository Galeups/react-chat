import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardSubtitle,
    Button,
    Form,
    InputGroup,
    Input,
    InputGroupAddon,
} from 'reactstrap';
import Moment from 'moment';
import firebase from '../../Firebase';
import ScrollToBottom from 'react-scroll-to-bottom';

import styles from './ChatRoom.module.scss';

function ChatRoom(props) {
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
                        <ScrollToBottom className="ChatContent">
                            {chats.map((item, idx) => (
                                <div key={idx} className="MessageBox">
                                    {item.type === 'join' || item.type === 'exit' ? (
                                        <div className="ChatStatus">
                                            <span className="ChatDate">{item.date}</span>
                                            <span className="ChatContentCenter">{item.message}</span>
                                        </div>
                                    ) : (
                                        <div className="ChatMessage">
                                            <div
                                                className={`${
                                                    item.nickName === nickName ? 'RightBubble' : 'LeftBubble'
                                                }`}
                                            >
                                                {item.nickName === nickName ? (
                                                    <span className="MsgName">Me</span>
                                                ) : (
                                                    <span className="MsgName">{item.nickName}</span>
                                                )}
                                                <span className="MsgDate"> at {item.date}</span>
                                                <p>{item.message}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </ScrollToBottom>
                        <footer className="StickyFooter">
                            <Form className="MessageForm" onSubmit={submitMessage}>
                                <InputGroup>
                                    <Input
                                        type="text"
                                        name="message"
                                        id="message"
                                        placeholder="Enter message here"
                                        value={newChat.message}
                                        onChange={onChange}
                                    />
                                    <InputGroupAddon addonType="append">
                                        <Button variant="primary" type="submit">
                                            Send
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Form>
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
