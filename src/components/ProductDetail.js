import React from 'react';

const ProductDetail = ({name}) => {
    const getUrl = () => {
        return "https://www.barcodelookup.com/".concat(name)
    }

    return (
        <div>
            <h1>{name}</h1>
            <div className='title'>
                <a href={ getUrl()}
                   target="_blank"
                   rel="noopener noreferrer">See product detail </a>
            </div>
        </div>
    )
}

export default ProductDetail