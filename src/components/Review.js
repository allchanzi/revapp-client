import React, {useState , useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { Line } from 'rc-progress';

import {
    Alert,
    Button,
    Input,
    UncontrolledPopover,
    Modal, ModalBody, ModalHeader
} from 'reactstrap';
import './styles.css'
import HistoryItem from "./HistoryItem";
import moment from "moment";


const uint8ArrayConcat = require('uint8arrays').concat
const uint8ArrayToString = require('uint8arrays').toString

const Review = ({ipfs, contract, account, id, product, done}) => {
    const [review_json, setReview] = useState({author: null,
                                                        address: null,
                                                        content: null,
                                                        date: null,
                                                        history: []});
    const [result_json, setResult] = useState({});
    const [content, setContent] = useState("");
    const [hash, setHash] = useState(null);
    const [error, setError] = useState(false);
    const [update, setUpdate] = useState(false);
    const [, setResultHash] = useState(null);
    const [modal, setModal] = useState(false)

    const onUpdateClick = () => {
        setContent(review_json.content)
        setUpdate(true)
    }

    useEffect(() => {
        const handleGetIPFSFile = async () => {
            if (contract != null) {
                contract.methods.getReviewById(id).call({from: account}).then(async (result) => {
                    let chunks = [];
                    for await (const chunk of ipfs.cat(result["0"])) {
                        chunks.push(chunk);
                    }
                    setHash(result["0"])
                    setReview(JSON.parse(uint8ArrayToString(uint8ArrayConcat(chunks))));
                    if (result["1"].length > 2){
                        chunks = [];
                        for await (const chunk of ipfs.cat(result["1"])) {
                            chunks.push(chunk);
                        }
                        setResultHash(result["1"])
                        console.log(JSON.parse(uint8ArrayToString(uint8ArrayConcat(chunks))))
                        setResult(JSON.parse(uint8ArrayToString(uint8ArrayConcat(chunks))));
                    }
                }).catch((err) => {
                    console.log("Error: ", err)
                    setError(true);
                })
            }
        }
        handleGetIPFSFile();
    }, [contract, account, product, id, ipfs]);


    const handleUpdateReview = async (data, e) => {
        review_json.history.push(hash)
        if (content.trim() === review_json.content.trim()) { setUpdate(false); return }
        const upd_hash = await ipfs.add(JSON.stringify(
            {"author": review_json.author,
                  "address": account,
                  "content": content,
                  "product": review_json.product,
                  "history": review_json.history,
                  "rating" : review_json.rating,
                  "date": moment().format("DD/MM/YYYY hh:mm:ss")}));

        contract.methods.updateReviewContent(id, upd_hash.path, product).send({from: account})
            .then((receipt) => { done(); setUpdate(false);})
            .catch((err) => {console.log(err)})

    }

    // const done = () => {
    //     setUpdate(false)
    //     window.location.reload();
    // }

    const selectColor = (value) => {
        if (value === undefined) { return "secondary" }
        if (value < 2) { return "success"} else
        if (value < 4) { return "warning"} else
        if (value < 7)  { return "danger"} else
        if (value === 0) { return "secondary"}
    }

    const toggle = () => {setModal( ( !modal && result_json.inserted_review_value_output !== undefined ) )}

    const getInTxRef = () => { return 'https://blockexplorer.bloxberg.org/tx/' +  result_json.txIn }

    const getOutTxRef = () => { return 'https://blockexplorer.bloxberg.org/tx/' +  result_json.txOut}

    const getPercentage = () => { return (1 / (1 + result_json.inserted_review_value_output)) * 100 }

    const getResultClass = () => {
        if (result_json.inserted_review_value_output === 0) {return <span className='analysis0'>Truthful</span>}
        if (result_json.inserted_review_value_output === 1) {return <span className='analysis1'>Truthful</span>}
        if (result_json.inserted_review_value_output === 2) {return <span className='analysis2'>Truthful</span>}
        if (result_json.inserted_review_value_output === 3) {return <span className='analysis3'>Truthful</span>}
        if (result_json.inserted_review_value_output === 4) {return <span className='analysis4'>Deceptive</span>}
        if (result_json.inserted_review_value_output === 5) {return <span className='analysis5'>Deceptive</span>}
        if (result_json.inserted_review_value_output === 6) {return <span className='analysis6'>Deceptive</span>}
    }

    const getResultColor = (value) => {
        if (value === undefined) {value=0}
        if (value < 2) { return "#155724"} else
        if (value < 4) { return "#856404"} else
        if (value < 7)  { return "#721c24"} else
        if (value === 0) { return "#1b1e21"}
    }

    return(
        (error ? "":
            <Alert color={selectColor(result_json != null ? (result_json.inserted_review_value_output) : 0)}>
                <div className="row">
                    <div className="col-9">
                        <div className='reviewHash row'>{hash}</div>
                        {!update ? <div className='reviewContent row'>{review_json.content}</div> :
                            (<div>
                                <Input
                                    type="textarea"
                                    name="content"
                                    id="content"
                                    value={content}
                                    onChange={(e) => { setContent(e.target.value );}}
                                />
                                <Button type='submit' onClick={handleUpdateReview}>Submit</Button>
                            </div>)}
                        <div className='reviewAuthor row'>
                            <div className="col-4">‎‎Author name: </div>
                            <div className='reviewAuthor col-6'>{review_json.author}</div>
                        </div>
                        <div className='stars row'>
                            <div className="col-4">Rating: </div>
                            <div className='reviewAuthor col-6'>
                                <StarRatings rating={review_json.rating} starDimension="20px" starSpacing="5px" />
                            </div>
                        </div>
                    </div>
                    <div className='reviewDate col-3 '>
                        {result_json.inserted_review_value_output === undefined
                            ? <div className='row reviewPercet'>Not processed yet</div>
                            : <div className='row reviewPercet' onClick={toggle}>
                                <Line percent={getPercentage()} strokeWidth="4" strokeColor={getResultColor(result_json.inserted_review_value_output)}/>
                                <Button className='btn-sm' onClick={toggle}>See analysis</Button>
                            </div>}
                        <Modal isOpen={modal} toggle={toggle} >
                            <ModalHeader toggle={toggle}>Result: {getResultClass()}</ModalHeader>
                            <ModalBody>
                                <div dangerouslySetInnerHTML={{ __html: result_json.inserted_review_text_output }} />
                                <div><a href={getInTxRef() } target="_blank" rel="noopener noreferrer">Input transaction</a>{' '}</div>
                                <div><a href={getOutTxRef() } target="_blank" rel="noopener noreferrer">Output transaction</a>{' '}</div>
                            </ModalBody>

                        </Modal>
                        {'history' in review_json && review_json.history.length > 0 ?
                            (<div className='row '>
                                <Button className='btn-sm' id="UncontrolledPopover" type="button">History</Button>
                                 <UncontrolledPopover placement="bottom" target="UncontrolledPopover">
                                {review_json.history.map((c) => {
                                     return <HistoryItem ipfs={ipfs} reviewHash={c}/>
                                })}
                                 </UncontrolledPopover>
                            </div>) : ""}
                        {account===review_json.address
                            ? <div className='row '>
                                <Button className='btn-sm' onClick={onUpdateClick}>Change</Button>
                              </div>
                            : ""}
                        <div className='row reviewDate'>{review_json.date}</div>
                    </div>
                </div>
            </Alert>
        )

    )
}

export default Review