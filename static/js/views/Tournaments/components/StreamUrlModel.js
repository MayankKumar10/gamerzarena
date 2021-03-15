/* eslint-disable */

import {
    func
} from "prop-types";
import React from "react";
import Modal from 'react-bootstrap/Modal'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import Info from '../../../components/Info/Info'
import styles from "./StreamUrlModel.module.scss";

export default function StreamUrlModel(props) {
    const [streamURL, setStreamURL] = React.useState(null);

    return ( <
        Modal show = {
            props.show
        }
        onHide = {
            () => {
                setStreamURL("");
                props.handleClose()
            }
        }
        backdrop = "static"
        keyboard = {
            false
        }
        className = {
            styles.streamModel
        } >
        <
        Form >
        <
        Modal.Header closeButton className = {
            styles.streamHeader
        } >
        <
        Modal.Title > Live Stream URL < /Modal.Title> <
        /Modal.Header> <
        Modal.Body >

        <
        Form.Group controlId = "formBasicUrl" >
        <
        Form.Label > Add your live Stream URL of your streaming platform {
            " "
        } <
        Info id = {
            3
        }
        /> <
        /Form.Label> <
        Form.Control type = "url"
        value = {
            streamURL
        }
        name = "stream_url"
        onChange = {
            (e) => setStreamURL(e.target.value)
        }
        placeholder = "Live stream url"
        required /
        > {
            /* <Form.Text className="text-muted">
                          We'll never share your email with anyone else.
                </Form.Text> */
        } <
        /Form.Group>

        <
        /Modal.Body> <
        Modal.Footer >
        <
        Button variant = "secondary"
        onClick = {
            () => {
                setStreamURL("");
                props.handleClose()
            }
        } >
        Close <
        /Button> <
        Button variant = "primary"
        type = "submit"
        onClick = {
            (e) => {
                e.preventDefault();
                props.submitStreamUrl(streamURL)
            }
        } > Submit < /Button> <
        /Modal.Footer> <
        /Form> <
        /Modal>
    );
}