import React, {useState , useEffect } from 'react';

import {PopoverBody, PopoverHeader} from 'reactstrap';

const uint8ArrayConcat = require('uint8arrays').concat
const uint8ArrayToString = require('uint8arrays').toString

const HistoryItem = ({ipfs, reviewHash}) => {
    const [review_json, SetReview] = useState({content: "aa"})
    useEffect(() => {
        const handleGetIPFSFile = async () => {
            const chunks = [];
            for await (const chunk of ipfs.cat(reviewHash)) {
                chunks.push(chunk);
            }
            SetReview(JSON.parse(uint8ArrayToString(uint8ArrayConcat(chunks))));
        }
        handleGetIPFSFile();
    }, [ipfs, reviewHash]);

    return (
        <div>
            <PopoverHeader>{reviewHash}</PopoverHeader>
            <PopoverBody>{review_json.content}</PopoverBody>
        </div>
    );
}

export default HistoryItem;