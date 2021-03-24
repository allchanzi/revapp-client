import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const uint8ArrayConcat = require('uint8arrays').concat
const uint8ArrayToString = require('uint8arrays').toString

const Result = ({reviewHash, resultHash, ipfs, modal}) => {
    const [result_json, SetResult] = useState({data: null,
                                                        iTx: null,
                                                        oTx: null});
    const [className, SetClassName] = useState("a");
    const handleGetIPFSFile = async () => {
        const chunks = [];
        for await (const chunk of ipfs.cat(resultHash)) {
            chunks.push(chunk);
        }
        SetResult(JSON.parse(uint8ArrayToString(uint8ArrayConcat(chunks))));
    };


    const toggle = () => modal = (!modal);

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} className={className} centered>
                <ModalHeader toggle={toggle}>Results for review</ModalHeader>
                <ModalBody>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default Result;