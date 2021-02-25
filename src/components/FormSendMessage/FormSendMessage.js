import React from 'react';

import styles from './FormSendMessage.module.scss';
import { Button, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';

const FormSendMessage = (props) => {
    const { submitMessage, onChange, message } = props;

    return (
        <Form className={styles.FormSendMessage} onSubmit={submitMessage}>
            <InputGroup>
                <Input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Enter message here"
                    value={message}
                    onChange={onChange}
                />
                <InputGroupAddon addonType="append">
                    <Button variant="primary" type="submit">
                        Send
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        </Form>
    );
};

FormSendMessage.propTypes = {};
FormSendMessage.defaultProps = {};

export default FormSendMessage;
