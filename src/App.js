//Modules
import React, {useState, useEffect} from 'react';
import { Spinner } from "reactstrap";

// Components
import Product from "./components/Product";
import ChooseProduct from "./components/ChooseProduct";
import Navigation from "./components/Navbar";
import Error from "./components/Error";

//Styles
import './App.css';

//SmartContracts
import RevApp from "./contracts/RevApp.json";
import getWeb3 from "./getWeb3";

// Initialize IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
// ipfs.bootstrap.add('/ip4/ipfs.ethernity.cloud/tcp/4001/ipfs/QmRBc1eBt4hpJQUqHqn6eA8ixQPD3LFcUDsn6coKBQtia5')

const App = () => {
    const [product, setProduct] = useState(null)
    const [showProductDetail, setShowProductDetail] = useState(false)
    const [w3, setWeb3] = useState(null)
    const [accounts, setAccounts] = useState(null)
    const [revAppContract, setRevAppContract] = useState(null)
    const [showError, setShowError] = useState(false)

    const onErrorProduct = () => {
        setShowProductDetail(false)
        setShowError(true)
        setProduct(null)
    }

    const handleShowProductDetail = (prod) => {
        setShowError(false)
        setProduct(prod);
        setShowProductDetail(true)
    }

    useEffect(() => {
        const init = async() => {
            if (w3 === null){
                try {
                    // Get network provider and web3 instance.
                    const web3 = await getWeb3();

                    // Use web3 to get the user's accounts.
                    const acc = await web3.eth.getAccounts();

                    // Get the contract instance.
                    const contract = new web3.eth.Contract(RevApp.abi, '0xcD39392B496730D867b74DEF0A79a53C610B0426');
                    // const storageContract = new web3.eth.Contract(RevApp.abi, RevApp.networks[networkId].address);
                    // Set web3, accounts, and contract to the state
                    setWeb3(web3);
                    setAccounts(acc);
                    setRevAppContract(contract);
                } catch (error) {
                    // Catch any errors for any of the above operations.
                    alert(
                        `Failed to load web3, accounts, or contract. Check console for details.`,
                    );
                    console.error(error);

                }
            }
        }
        init();
    }, [w3]);

    return (
            <div className="container">
                {showError ? <Error error="Invalid item EAN code!!!" className="modal_danger"/> : ""}
                <Navigation/>
                {(revAppContract == null || accounts == null) ? (
                    <div className='row'>
                        <Spinner color="primary"/>
                        <Spinner color="secondary"/>
                        <Spinner color="success"/>
                        <div className='loading'>Loading information</div>
                        <Spinner color="danger"/>
                        <Spinner color="warning"/>
                        <Spinner color="info"/>
                    </div>) : [
                    (showProductDetail ? (<Product web3={w3} ipfs={ipfs} contract={revAppContract} account={accounts[0]}
                                                                              product={product} onError={onErrorProduct} />) : (
                        <ChooseProduct showProductDetail={handleShowProductDetail}/>)
                    )]}
            </div>
    )
}

export default App;