import React, {useState } from 'react';

import {
    Modal, ModalHeader
} from 'reactstrap';
import "./styles.css"
const Error = ({error}) => {
    const [modal, setModal] = useState(true)
    const toggle = () => { setModal( ( !modal) ) }
    return (
    <Modal isOpen={modal} toggle={toggle} className="modal_danger">
        <ModalHeader toggle={toggle} className="modal_danger">
                {error}
        </ModalHeader>
    </Modal>)
}

export default Error