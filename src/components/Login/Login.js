// import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Jumbotron, Spinner, Form, Button, FormGroup, Label, Input } from 'reactstrap';
import firebase from '../../Firebase';

import styles from './Login.module.scss';

const Login = () => {
    const history = useHistory();
    const [creds, setCreds] = useState({ nickName: '' });
    const [showLoading, setShowLoading] = useState(false);
    const ref = firebase.database().ref('users/');

    const onChange = (e) => {
        e.persist();
        setCreds({ ...creds, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setShowLoading(true);

        ref.orderByChild('nickName')
            .equalTo(creds.nickName)
            .once('value', (snapshot) => {
                if (snapshot.exists()) {
                    setShowLoading(false);
                    localStorage.setItem('nickName', creds.nickName);
                    history.push('/roomlist');
                } else {
                    setShowLoading(false);
                    const newUser = firebase.database().ref('users/').push();
                    newUser.set(creds).then();
                    localStorage.setItem('nickName', creds.nickName);
                    history.push('/roomlist');
                }
            })
            .then();
    };

    return (
        <div className={styles.login}>
            {showLoading && <Spinner color="primary" />}

            <Jumbotron>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label>Nick name</Label>
                        <Input
                            type="text"
                            name="nickName"
                            id="nickName"
                            placeholder="Enter Your Nick Name"
                            value={creds.nickName}
                            onChange={onChange}
                        />
                    </FormGroup>

                    <Button variant="primary">Login</Button>
                </Form>
            </Jumbotron>
        </div>
    );
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
