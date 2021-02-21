import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Jumbotron, Spinner, Form, Button, FormGroup, Label, Input } from 'reactstrap';
import firebase from '../../Firebase';

import styles from './AddRoom.module.scss';

const AddRoom = () => {
    const history = useHistory();
    const [room, setRoom] = useState({ roomName: '' });
    const [showLoading, setShowLoading] = useState(false);
    const refRooms = firebase.database().ref('rooms/');

    const onSave = (e) => {
        e.preventDefault();
        setShowLoading(true);

        refRooms
            .orderByChild('roomname')
            .equalTo(room.roomName)
            .once('value', (snapshot) => {
                setShowLoading(false);
                if (snapshot.exists()) {
                    return (
                        <div>
                            <Alert color="primary">Room name already exist!</Alert>
                        </div>
                    );
                } else {
                    const newRoom = firebase.database().ref('rooms/').push();
                    newRoom.set(room).then(() => {
                        history.goBack();
                    });
                }
            })
            .then();
    };

    const onChange = (e) => {
        e.persist();
        setRoom({ ...room, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.AddRoom}>
            {showLoading && <Spinner color="primary" />}
            <Jumbotron>
                <h2>Please enter new Room</h2>
                <Form onSubmit={onSave}>
                    <FormGroup>
                        <Label for="roomName">Room name</Label>
                        <Input
                            type="text"
                            name="roomName"
                            id="roomName"
                            placeholder="Enter Room name"
                            value={room.roomName}
                            onChange={onChange}
                        />
                    </FormGroup>

                    <Button variant="primary" type="submit">
                        Add
                    </Button>
                </Form>
            </Jumbotron>
        </div>
    );
};

AddRoom.propTypes = {};

AddRoom.defaultProps = {};

export default AddRoom;
