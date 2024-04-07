import React, { useState } from 'react';
import { ethers } from 'ethers';
import SimpleStorage from './contracts/storage_contract_abi.json';


const SimpleStore = () => {
    console.log(SimpleStorage); // printing abi
    let contractAddress = "0x54Bd0fA719e59c949487E1f1833F56ebB962CEE9";

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState("Connect Wallet");

    const [currentContractVal, setCurrentContractVal] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            window.ethereum.request({ method: "eth_requestAccounts" })
            .then(results => {
                accountChangedHandler(results[0]);
                setConnButtonText("Wallet Connected");
            })
            .catch(error => {
                setErrorMessage(error.message);
            });

        } else {
            console.log("Need to install MetaMask");
            setErrorMessage("Please install MetaMask extension to your browser");
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }

    const chainChangedHandler = () => {
        window.location.reload();
    }

    window.ethereum.on("accountsChanged", accountChangedHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("Provider: " + tempProvider);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        console.log("Signer: " + tempSigner);
        // printing abi 
        console.log(SimpleStorage.abi);

        let tempContract = new ethers.Contract(contractAddress, SimpleStorage, tempSigner);
        console.log("Contract: " + tempContract);
        setContract(tempContract);
    }

    const setHandler =  (event) => {
        event.preventDefault();
        console.log("sending " + event.target.setNum.value + " to contract");
        contract.set(event.target.setNum.value)
    }

    const getCurrentVal = async () => {
        let val = await contract.get();
        setCurrentContractVal(val);
    }

    return (
        <div>
            <h4> {"Get/Set contract interactions"} </h4>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <div> 
                <h3> Address: {defaultAccount} </h3>
            </div>

            <form onSubmit={setHandler}>
                <input type="text" name="setNum" />
                <button type="submit">Set value</button>
            </form>
            <button onClick={getCurrentVal}>Get</button>
            <p>{errorMessage}</p>
            <p>{currentContractVal}</p>
        </div>
    )
}

export default SimpleStore;











