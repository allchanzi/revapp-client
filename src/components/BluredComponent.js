import React from 'react';
import {Alert} from "reactstrap";
import StarRatings from 'react-star-ratings';
import { Line } from 'rc-progress';
import "./styles.css"

const Blured = () => {

    return (
        <div className="blur">
            <Alert color="success">
                <div className="row">
                    <div className="col-9">
                        <div className='reviewHash row'>Lorem Ipsum is simply dummy text of the printing and typesetting.</div>
                        <div className='reviewAuthor row'>
                            <div className="col-4">‎‎Author name: </div>
                            <div className='reviewAuthor col-6'>Author</div>
                        </div>
                        <div className='stars row'>
                            <div className="col-4">Rating: </div>
                            <div className='reviewAuthor col-6'>
                                <StarRatings rating={4} starDimension="20px" starSpacing="5px" />
                            </div>
                        </div>
                    </div>
                    <div className='reviewDate col-3 '>
                        <div className='row reviewPercet'>
                                <Line percent="100" strokeWidth="4" strokeColor="#155724"/>
                            </div>
                        <div className='row reviewDate'>1.1.1999</div>
                    </div>
                </div>
            </Alert>
            <Alert color="danger">
                <div className="row">
                    <div className="col-9">
                        <div className='reviewHash row'>Lorem Ipsum is simply dummy text of the printing and typesetting.</div>
                        <div className='reviewAuthor row'>
                            <div className="col-4">‎‎Author name: </div>
                            <div className='reviewAuthor col-6'>Author</div>
                        </div>
                        <div className='stars row'>
                            <div className="col-4">Rating: </div>
                            <div className='reviewAuthor col-6'>
                                <StarRatings rating={4} starDimension="20px" starSpacing="5px" />
                            </div>
                        </div>
                    </div>
                    <div className='reviewDate col-3 '>
                        <div className='row reviewPercet'>
                            <Line percent="25" strokeWidth="4" strokeColor="#721c24"/>
                        </div>
                        <div className='row reviewDate'>1.1.1999</div>
                    </div>
                </div>
            </Alert>
            <Alert color="warning">
                <div className="row">
                    <div className="col-9">
                        <div className='reviewHash row'>Lorem Ipsum is simply dummy text of the printing and typesetting.</div>
                        <div className='reviewAuthor row'>
                            <div className="col-4">‎‎Author name: </div>
                            <div className='reviewAuthor col-6'>Author</div>
                        </div>
                        <div className='stars row'>
                            <div className="col-4">Rating: </div>
                            <div className='reviewAuthor col-6'>
                                <StarRatings rating={4} starDimension="20px" starSpacing="5px" />
                            </div>
                        </div>
                    </div>
                    <div className='reviewDate col-3 '>
                        <div className='row reviewPercet'>
                            <Line percent="50" strokeWidth="4" strokeColor="#856404"/>
                        </div>
                        <div className='row reviewDate'>1.1.1999</div>
                    </div>
                </div>
            </Alert>
            <Alert color="secondary">
                <div className="row">
                    <div className="col-9">
                        <div className='reviewHash row'>Lorem Ipsum is simply dummy text of the printing and typesetting.</div>
                        <div className='reviewAuthor row'>
                            <div className="col-4">‎‎Author name: </div>
                            <div className='reviewAuthor col-6'>Author</div>
                        </div>
                        <div className='stars row'>
                            <div className="col-4">Rating: </div>
                            <div className='reviewAuthor col-6'>
                                <StarRatings rating={4} starDimension="20px" starSpacing="5px" />
                            </div>
                        </div>
                    </div>
                    <div className='reviewDate col-3 '>
                        <div className='row reviewPercet'>
                            Not processed yet
                        </div>
                        <div className='row reviewDate'>1.1.1999</div>
                    </div>
                </div>
            </Alert>


        </div>
    )
}

export default Blured