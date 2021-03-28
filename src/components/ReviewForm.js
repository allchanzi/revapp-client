import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import StarRatings from 'react-star-ratings';

import {Button, Form, FormGroup, Label, Input, Spinner} from 'reactstrap';
import moment from 'moment'

function ReviewForm( {ipfs, contract, account, product, done}) {
    const { handleSubmit } = useForm();
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [stars, setStars] = useState(0)
    const [numberOfStars, ] = useState(5)
    const [waitForTransaction, setWaitForTransaction] = useState(false)

    const handleAddReview = async (data, e) => {
        setWaitForTransaction(true)
        const hash = await ipfs.add(JSON.stringify(
            {"author": author,
                  "address": account,
                  "content": content,
                  "product": product,
                  "history": [],
                  "rating" : stars,
                  "date": moment().format("DD/MM/YYYY hh:mm:ss")}));
        contract.methods.insertReview(hash.path, product).send({from: account})
            .then(receipt => { try {e.target.reset(); setWaitForTransaction(false); done();} catch (e) {
                console.log(e)
                setWaitForTransaction(false);
            }})
            .catch(err => { alert("Error: transaction can't be completed !!! Redirecting to main page.");
                            setWaitForTransaction(false);
                            window.location.reload();
            })
    }

    const handleError = (errors, e) => {
        console.log(errors, e)
    }

    return (
        <div>
            <Form onSubmit={handleSubmit(handleAddReview, handleError)} className='reviewForm'>
                <FormGroup>
                    <Label for="author">User</Label>{' '}
                    <Input type="text"
                           id="author"
                           placeholder="Put your wallet number or create alias"
                           name="author"
                           onChange={(e) => { setAuthor(e.target.value );}}/>
                </FormGroup>
                <FormGroup>
                    <Label for="content">Text</Label>
                    <Input
                        type="textarea"
                        name="content"
                        id="content"
                        placeholder="Start typing your opinion ..."
                        onChange={(e) => { setContent(e.target.value); }}/>{' '}
                </FormGroup>
                <Button type='submit'>Submit</Button>
                {waitForTransaction ? <Spinner color="info"/> : ""}
            </Form>
            <StarRatings
                rating={stars}
                starRatedColor="yellow"
                changeRating={(e, n) => { setStars(e);}}
                numberOfStars={numberOfStars}
                name='rating'
            />
        </div>

    );
}

export default ReviewForm