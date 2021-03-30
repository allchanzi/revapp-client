import React, {useState } from 'react';

import {
    Modal, ModalHeader
} from 'reactstrap';
import "./styles.css"
const Error = ({error, className}) => {
    const [modal, setModal] = useState(true)
    const toggle = () => { setModal( ( !modal) ) }
    return (
    <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle} className={className}>
                {error}
        </ModalHeader>
    </Modal>)
}

export default Error