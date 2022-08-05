import React, { useEffect } from "react";

import {
	useColorModeValue,
	Box,
	Container,
} from "@chakra-ui/react";

import { useAuth } from "../../contexts/AuthContext";
import { useDonate } from "../../contexts/DonateContext";
import { DonateView } from "./DonateView";
import NavBar from 'components/NavBar'

import {
	loadBeneficiaryCount,
	loadBeneficiary,
	loadReleasable,
	loadPriceForAmount,
	loadCrowdFundingParams,
	loadIndex,
	loadTotalParticipant,
	totalDonateAmount,
	loadRefererAddress,
} from "utils/tokenVestingsInteract";

import {CHAIN_ID} from '../../constants/index';

export default function DonateComponent(props) {
	const { currentAccount, currentNetwork} = useAuth();
	const {
		setTotal,
		setDataDonate,
		setParticipantReleased,
		setTotalParticipant,
		setPriceForAmount,
		setRefererAddress,
		setBeneficiaryCount,
		setBeneficiaryData,
		setReleasable,
		setUserIndex,
	} = useDonate();

	const color = useColorModeValue("gray.800", "inherit");
	
	useEffect(() => {
		async function fetchCrowd() {
			const crowdParams = await loadCrowdFundingParams(props.id);
			setDataDonate(crowdParams);
		}
		fetchCrowd();
	}, [currentAccount, props.id, setDataDonate]);
	
	useEffect(() => {
		async function beneficiaryCount() {
			const beneficiaryCount = await loadBeneficiaryCount(props.id);
			setBeneficiaryCount(beneficiaryCount);
		}		
		beneficiaryCount();	
	},[props.id, setBeneficiaryCount, setParticipantReleased])
	
	useEffect(() => {
		async function fetchTotalDonate() {
			const totalDonate = await totalDonateAmount(props.id);
			setTotal(totalDonate);
		}
		async function fetchTotalParticipants() {
			const totalParticipants = await loadTotalParticipant(props.id);
			setTotalParticipant(totalParticipants);
		}
		async function getPriceForAmount() {
			try {
				const price = await loadPriceForAmount(props.id, '100000000000000000000'); // get price for 100 USDT
				setPriceForAmount(price);	
			} catch(err) {
				setPriceForAmount({days: 0, rate: 100, tokens: "1000000000000000000000"});
			}
		}
		async function getRefererAddress() {
			try {
				const add = await loadRefererAddress(props.id, currentAccount);
				setRefererAddress(add);
			} catch(err) {
				setRefererAddress('');
			}
		}
		fetchTotalDonate();
		fetchTotalParticipants();
		getPriceForAmount();	
		getRefererAddress();
	}, [setTotal, setTotalParticipant, setPriceForAmount, props.id, currentAccount, setRefererAddress]);
	
	useEffect(() => {
		async function Index() {
			const reponseIndex = await loadIndex(props.id, currentAccount);
			if(reponseIndex === undefined) return;
			setUserIndex(reponseIndex[1]);
			if(reponseIndex[0]) setBeneficiaryData(await loadBeneficiary(props.id, reponseIndex[1]));
		}
		Index();
	},[currentAccount, setUserIndex, setBeneficiaryData, props.id])
	
	useEffect(() => {
		async function getReleasable() {
			const releasable = await loadReleasable(props.id, currentAccount);
			setReleasable(releasable);
		}
		getReleasable();
	}, [setReleasable, currentAccount, props.id])
	
	useEffect(() => {
		// Switch to BSC mainnet
		if(currentNetwork !== undefined && currentNetwork !== CHAIN_ID) {
			window.ethereum.request({
				method: "wallet_addEthereumChain",
				params: [{
					chainId: "0x38",
					rpcUrls: ["https://bsc-dataseed4.ninicoin.io"],
					chainName: "Binance Smart Chain",
					nativeCurrency: {
						name: "BNB",
						symbol: "BNB",
						decimals: 18
					},
					blockExplorerUrls: ["https://bscscan.com/"]
				}]
			});
		}
	}, [currentNetwork, currentAccount])
	
	return (
		<>
		{currentNetwork !== CHAIN_ID ? 
			<>
			<NavBar action="/" showMenu={false}/>
			<Box as="section" height="100vh" overflowY="auto">
			</Box>
			</> :
			<>
			<NavBar action="/" showMenu={true}/>
			<Box as="section" height="100vh" overflowY="auto">
			<Container 
			color={color}
			maxW='container.lg'
			>
			<DonateView id={props.id} referer={props.referer} />
			</Container>
			</Box>
			</>}
			</>
			);
		}