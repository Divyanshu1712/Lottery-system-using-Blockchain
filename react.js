import React, { useEffect, useState } from 'react';
import Web3 from 'web3'; // Assuming you're using Web3.js

const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address

//System deploy where user connect with meta mask

const Lottery = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [lotteryContract, setLotteryContract] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isEntered, setIsEntered] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        // Connect to the blockchain using a provider (e.g., Infura)
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Request access to user accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccounts(accounts);

        // Create an instance of the lottery contract
        const lottery = new web3Instance.eth.Contract(YOUR_CONTRACT_ABI, contractAddress); // Replace with your contract ABI
        setLotteryContract(lottery);
      } catch (error) {
        console.error('Error connecting to blockchain:', error);
      }
    };

    // Check if MetaMask or a compatible wallet is available

    if (window.ethereum) {
      connect();
    } else {
      console.error('Please install MetaMask or a compatible wallet.');
    }
  }, []);

  // Helper function to check if user is already entered 

  const isUserEntered = async () => {
    if (lotteryContract && accounts[0]) {
      const entered = await lotteryContract.methods.players(accounts[0]).call();
      setIsEntered(entered);
    }
  };

  // Function to enter the lottery (assuming there's MetaMask or compatible wallet)

  const enterLottery = async () => {
    if (!lotteryContract || !accounts[0]) return;

    try {
      await lotteryContract.methods.enter().send({
        from: accounts[0],
        value: '1000000000000000000', // 1 ETH in Wei
        gas: 1000000, // Gas limit (adjust as needed)
      });
      setIsEntered(true);
    } catch (error) {
      console.error('Error entering lottery:', error);
    }
  };

  // Function to fetch list of players (assuming it's allowed by your contract)
  const fetchPlayers = async () => {
    if (lotteryContract) {
      const players = await lotteryContract.methods.players.call();
      setPlayers(players);
    }
  };

  // Function to pick a winner (assuming it's a function only the owner can call)

  const pickWinner = async () => {
    if (!lotteryContract || !accounts[0] || !(await lotteryContract.methods.owner().call()) === accounts[0]) {
      return; // Only owner can call this function
    }

    try {
      await lotteryContract.methods.pickWinner().send({
        from: accounts[0],
        gas: 1000000, // Gas limit (adjust as needed) ( Need to connect with metamask with 1 ETH contact.)
      });
    } catch (error) {
      console.error('Error picking winner:', error);
    }
  }
}  
