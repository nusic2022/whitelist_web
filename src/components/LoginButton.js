import React, { useEffect } from 'react'
import { Button, Image, useToast, Box } from '@chakra-ui/react';
import { checkIfWalletIsConnected ,connectWallet } from 'services/walletConnections';
import { useAuth } from 'contexts/AuthContext';

import BNBLogo from "assets/bnb-logo.svg";
import ETHLogo from "assets/eth-logo.svg";
import MATICLogo from "assets/matic-logo.svg";
// import FTMLogo from "assets/ftm-logo.svg";
// import AVAXLogo from "assets/avax-logo.svg";
import intl from "../utils/intl";

export default function LoginButton() {
	
	const toast = useToast();
	const id = 'toast'
	const { currentAccount, setCurrentAccount, currentNetwork } = useAuth();
	const handleLogin = async() => {
		if(!window.ethereum) {
			if (!toast.isActive(id)) {
				toast({
					id,
					title: intl.get("login"),
					description: intl.get("please_install_metamask"),
					status: 'error',
					duration: 4000,
					isClosable: true,
				})
			}
			return;
		}
		const addr = await connectWallet();
		setCurrentAccount(addr);
		// setCurrentAccount('0x4972f870b0692c0b768e81387cc9d26f8fc1e895'); // ######
	}
	const logo = (chainId) => {
		if(chainId === 97 || chainId === 56) return BNBLogo;
		else if(chainId === 80001 || chainId === 137) return MATICLogo;
		else if(chainId === 1 || chainId === 3 || chainId === 4 || chainId === 42 || chainId === 5) return ETHLogo;
	}
	
	useEffect(() => {
		const getAccount = async() => {
			if(window.location.pathname!=="/") {
				if(!window.ethereum) {
					if (!toast.isActive(id)) {
						toast({
							id,
							title: intl.get("login"),
							description: intl.get("please_install_metamask"),
							status: 'error',
							duration: 4000,
							isClosable: true,
						})
					}
				} else {
					setCurrentAccount(await checkIfWalletIsConnected());
					// setCurrentAccount('0x4972f870b0692c0b768e81387cc9d26f8fc1e895'); // ######
				}
			}
		}
		getAccount()
	}, [setCurrentAccount, toast]);
	
	return (
		<>
		{ currentAccount ? 
		<Box>
			<Button fontWeight={220}>
			<Image src={logo(currentNetwork)} h="15px" mr="2"/>
			{currentAccount.substring(0, 7)+"...."+currentAccount.substring(currentAccount.length-6)}
			</Button>
		</Box>
		: 
		<Button fontWeight={300} onClick={handleLogin}>
		{intl.get("connect_wallet")}
		</Button>
	}
	</>
	
	)
}
