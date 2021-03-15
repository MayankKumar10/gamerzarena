/* eslint-disable */

import React from 'react';
import styles from './Status.module.scss';

const Status = (props) => {
    function slugify(text, identifier) {
        identifier = identifier === undefined ? '-' : identifier;
        return text.toString().toLowerCase()
            .replace(/\s+/g, identifier) // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, identifier) // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    }

    return ( <
        div className = {
            `${styles.status} ${styles[slugify(props.status, '_')]}`
        } > {
            props.status
        } <
        /div>
    )
}

export default Status;