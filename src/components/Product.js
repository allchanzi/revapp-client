import React, {useEffect, useState} from 'react';
import Review from './Review'
import ProductDetail from "./ProductDetail";
import ReviewForm from "./ReviewForm";
import {Button, Spinner} from "reactstrap";
import Pages from "./Pagination";
import Error from "./Error";
import Blured from "./BluredComponent";
const BN = require('bn.js');

const Product = ({web3, ipfs, contract, account, product, onError}) => {
    const [addReview, setAddReview] = useState(false);
    const [reviewIds, setReviewIds] = useState([]);
    const [cost , setCost] = useState(null);
    const [doRender] = useState(true);
    const [isFetched, setFetched] = useState(false);
    const [blur, setBlur] = useState(null);
    const [update, setUpdate] = useState(false);
    const [freeInsert, setFreeInsert] = useState(false);
    const [page, setPage] = useState(0);
    const [pageCount, ] = useState(10);
    const [reviewCount, setReviewCount] = useState(0);
    const [waitForPayment, setWaitForPayment] = useState(false)
    const [showError, setShowError] = useState(false)
    useEffect(() => {
        const getProductReviews = async () => {
            if (contract != null) {
                contract.methods.getReviewCountForProduct(product).call({from: account})
                    .then((result) => {
                        setReviewCount(v => result)
                        if ((result >= 0)) {
                            contract.methods.getReviewIdsForProductByPage(product, page, pageCount)
                                .call({from: account})
                                .then((result) => {
                                    if (result[0] === "0" ){
                                        setBlur(v => 'blur')
                                        getPrice(true)
                                        return
                                    }
                                    setReviewIds(ids => result);
                                    contract.methods.getFreeInsertForAddress().call({from: account})
                                        .then((result) => { setFreeInsert(r => result);})
                                        .catch((err) => { console.log(err); })
                                })
                                .catch((err) => { console.log(err); })
                        } else {
                            onError()
                        }
                    })
                    .catch((err) => {console.log(err); })
            }
        }

        const getPrice = (render) => {
            if (render){
                fetch('https://ethgasstation.info/api/ethgasAPI.json?api-key='.concat(process.env.REACT_APP_API_KEY))
                    .then(response => response.json())
                    .then(data => {setCost(c => data['safeLow'] / 10); setFetched(f =>true);},
                          error => {console.log("Error price", error)})
                    .catch((err) => {console.log("Error price", err)})
            }
        }

        getProductReviews();
        setUpdate(v =>false);
    }, [account, contract, product, onError, page, pageCount, update, blur]);

    const handleAddReviewClick = () => { setAddReview(true); }

    const handleAddedReview = (success) => {
        // if (success) {
            setShowError(true)
            setAddReview(false)
            setUpdate(true)
        // }
    }

    const onPageChange = (pg) => {
        setPage(pg);
    }

    const getAddButtonText = () => {
        if ( freeInsert ){
            return "Add Review for Free"
        }
        return "Add Review"
    }

    const payToShow = () => {
        if (contract != null) {
            const value = cost * 21000
            const bn_value = new BN(value)
            setWaitForPayment(true)
            contract.methods.payForReviews(product).send({from: account, value: web3.utils.toWei(bn_value, "gwei")})
                .then((receipt) => {

                    setBlur(false)
                    setWaitForPayment(false)
                })
                .catch((err) => {
                    console.log(err)
                    setWaitForPayment(false)
                    alert("Transaction refused")
                });}
    }

    return(
        (!doRender ? "" :
        <div className='container main'>
            {showError ? <Error error="Result for your review should by available in 24h" className="modal_info"/> : ""}
            <ProductDetail name={product}/>
            {addReview
                ? (<ReviewForm ipfs={ipfs} contract={contract} account={account}
                               product={product} done={handleAddedReview}/>)
                : <Button onClick={handleAddReviewClick} className='reviewButton'>{getAddButtonText()}</Button>}
            <br/>
            <div className='showButton'>
                {isFetched && blur === 'blur' ? <Button onClick={payToShow}>Show for {cost * 21000 / 1000000000} ETH</Button> : <br/>}
                {waitForPayment ? <Spinner color="info"/> : ""}
            </div>
            {blur === 'blur' ? <Blured /> :
                (<div className="reviewBlock">
                {reviewIds.map((id) => {
                    return <Review key={id}
                                   ipfs={ipfs}
                                   contract={contract}
                                   account={account}
                                   id={id}
                                   product={product}
                                   done={handleAddedReview}/>
                    })
                }
            <Pages length={Math.ceil(reviewCount / pageCount)} onPageChange={onPageChange} />
           </div>)}
        </div>
        )
    )
}

export default Product