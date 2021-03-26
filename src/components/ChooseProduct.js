import React, {useState} from 'react';

import {
    Button,
    Form, Input, InputGroup, InputGroupAddon
} from 'reactstrap';
import {useForm} from "react-hook-form";

const ChooseProduct = ({showProductDetail}) => {
    const { handleSubmit  } = useForm();
    const [ean, setEan] = useState("");


    const handleForm = (data, e) => {
        if (ean.length === 12) {
            showProductDetail("0".concat(ean));
            return
        }
        showProductDetail(ean);
    }

    return (
        <div className='container'>
            <Form onSubmit={handleSubmit(handleForm)}>
                <InputGroup>
                    <Input placeholder="please enter your barcode number ... "
                           onChange={(e) => { setEan(e.target.value );}}/>
                    <InputGroupAddon addonType="append"><Button>Search</Button></InputGroupAddon>
                </InputGroup>
            </Form>
            <a href='https://www.barcodelookup.com/api' target="_blank" rel="noopener noreferrer">Find your barcide product</a>
        </div>
    )
}

export default ChooseProduct