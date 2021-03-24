import React, {useEffect, useState} from 'react';
import Review from './Review'
import ProductDetail from "./ProductDetail";
import ReviewForm from "./ReviewForm";
import { Button} from "reactstrap";
import Pages from "./Pagination";

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
                                    setReviewIds(ids => result);
                                    if (result.length > 10){
                                        setBlur(v => 'blur')
                                        getPrice(true)
                                    }
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
                    .then(data => {setCost(c => data['safeLow']); setFetched(f =>true);},
                          error => {console.log("Error price", error)})
                    .catch((err) => {console.log("Error price", err)})
            }
        }

        getProductReviews();
        setUpdate(v =>false);
    }, [account, contract, product, onError, page, pageCount, update]);

    const handleAddReviewClick = () => { setAddReview(true); }

    const handleAddedReview = (success) => {
        // if (success) {
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
            web3.eth.sendTransaction({from: account, to: contract.address, value: web3.toWei(cost, "ether")})
                .then((receipt) => {
                    setBlur(false)
                })
                .catch((err) => {
                    alert("Transaction refused")
                });
        }
    }

    return(
        (!doRender ? "" :
        <div className='container main'>
            <ProductDetail name={product}/>
            {addReview
                ? (<ReviewForm ipfs={ipfs} contract={contract} account={account}
                               product={product} done={handleAddedReview}/>)
                : <Button onClick={handleAddReviewClick} className='reviewButton'>{getAddButtonText()}</Button>}
            <br/>
            <div className='showButton'>
                {isFetched && blur === 'blur' ? <Button onClick={payToShow}>Show for {cost * 21000 / 1000000000} ETH</Button> : <br/>}
            </div>
            <div className={blur === 'blur' ? "blur reviewBlock" : "reviewBlock"}>
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
           </div>
        </div>
        )
    )
}

export default Product