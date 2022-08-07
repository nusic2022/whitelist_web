import React, { useEffect } from "react";
import Donate from "views/Donate";
import Home from "views/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { useColorModeValue, Box } from '@chakra-ui/react'
import './App.css'

function App() {
  const { 
    setCurrentAccount, 
    setCurrentNetwork, 
  } = useAuth()
  const bg = useColorModeValue("#8412AE", "gray.800");

  useEffect(() => {
    const initialCheck = async() => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentNetwork(parseInt(chainId, 16))
  
        window.ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          setCurrentAccount(accounts[0]);
					// setCurrentAccount('0x4972f870b0692c0b768e81387cc9d26f8fc1e895'); // ######
          window.location.reload()
        })
        
        window.ethereum.on('chainChanged', function (chainId) {
          // Time to reload your interface with the new chainId
          setCurrentNetwork(parseInt(chainId, 16))
          window.location.reload()
        })

      } catch(err) {
        console.log(err)
      }
    }
    initialCheck();
  }, [setCurrentAccount, setCurrentNetwork]);

  return (
		<Box bg={bg}>
    <Router>
        <Routes>
					<Route exact path="/" element={<Home/>}/>
          <Route exact path="/:id/:ref" element={<Donate/>}/>
          <Route exact path="/:id" element={<Donate/>}/>
        </Routes>
    </Router>
		</Box>
  );
}

export default App;
