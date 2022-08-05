import React, { useState, useEffect} from "react";
import {
	Stack,
	Heading,
	Box,
	Button,
	Text,
	useColorModeValue,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Progress,
	Image,
} from '@chakra-ui/react'
import { ethers } from "ethers";
import { Card } from '../common/Card';
// import { Blur } from '../common/Blur';

import { useDonate } from "contexts/DonateContext";

import { InfoTableComponent } from "./InfoTableComponent";
import { InputDonate } from "./InputDonate";
import {InputDonateWithAddReferer} from './InputDonateWithAddReferer';
import { DonateStatus } from "./DonateStatus";
// import { TopList } from "./TopList";
import { ReferalData } from "./ReferalData";
import { RefereeList } from "./RefereeList";
import donateABI from "abi/Whitelist_abi";
import { tokenVestingAddress, banners, CAP, NO_REFERALS_TAG, ZERO_ADDRESS } from "constants";
import Countdown from '../common/Countdown';
// import { AiTwotoneCheckCircle } from "react-icons/ai";
import { getGlobalTime } from "../common/Worldtime";
import { useAuth } from 'contexts/AuthContext';
import { DateTime } from "luxon";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import intl from '../../utils/intl';
import {format} from '../../utils/format';
import { AddReferer } from "./AddReferer";

export const DonateView = (props) => {
	const { 
		// priceRange, 
		beneficiaryData, 
		setBeneficiaryData, 
		beneficiaryCount,
		releasable, 
		setReleasable, 
		donateData, 
		// totalAmount,
		refererAddress,
		priceForAmount,
		redeemable
	} = useDonate();
	
	const [ isLoading, setIsLoading ] = useState(false);
	const [ isDisabled, setIsDisabled ] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ showReleaseButton, setShowReleaseButton ] = useState(false);
	const [ showDonateButton, setShowDonateButton ] = useState(false);
	const { currentAccount } = useAuth()
	const [ modalOptions, setModalOptions ] = useState({
		message: '', 
		buttonName: 'Claim', 
		fun: "release",
	});
	const [ countdownOptions, setCountdownOptions ] = useState({
		circleColor: "#7C04A8",
		title: "",
		timeTillDate: 0,
	});
	const [progressRate, setProgressRate] = useState({sold: 0, total: 100, rate: 0});
	const [donationPrice, setDonationPrice] = useState({days: 0, rate: 100, tokens: "1000000000000000000000"});

	const toast = useToast()
	
	const { ethereum } = window; //injected by metamask
	const provider = new ethers.providers.Web3Provider(ethereum); 
	const signer = provider.getSigner(); 
	const TokenVestingContract = new ethers.Contract(tokenVestingAddress[props.id], donateABI, signer);
	const referalUrl = `https://nusic.vip/${props.id}/`;
	// console.log("refererAddress", refererAddress);

	const release = async () => {
		setIsLoading(true);
		try {
			try {
				const tx = await TokenVestingContract.release()
				toast({
					title: intl.get("claim"),
					description: `${intl.get("waiting_for_confirmation")}, hash: ${tx.hash}`,
					status: 'warning',
					duration: 4000,
					isClosable: true,
				})
				
				await tx.wait(2);
				toast({
					title: intl.get("claim"),
					description: intl.get("claim_successfully"),
					status: 'success',
					duration: 4000,
					isClosable: true,
				})
				setReleasable(0);
				setShowReleaseButton(false);
				setBeneficiaryData({
					...beneficiaryData,
					releasedAmount: beneficiaryData.releasedAmount.add(releasable),
				})
				setIsLoading(false);
				setIsDisabled(true);
				onClose();
			} catch(err) {
				console.log(err)
				toast({
					title: `${intl.get("claim")} Error`,
					description: `${err.data.message}`,
					status: 'error',
					duration: 4000,
					isClosable: true,
				})
				setIsLoading(false);
			}
		} catch(err) {
			console.log('Error Claim', err)
		}
	}
		
	useEffect(() => {
		const initCountdownOptions = async () => {
			await countdownData();
		};
		const countdownData = async() => {
			// Get phrase no, phrase name and timeTillDate
			if(donateData === undefined) return;
			const current = await getGlobalTime();
			const donateStart = parseInt(donateData.startTimestamp);
			const donateEnd = parseInt(donateData.endTimestamp);
			const genesisStart = parseInt(donateData.genesisTimestamp);
			const cliffEnd = parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff);
			const releaseEnd = parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff) + parseInt(donateData.duration);
			
			if(current < donateStart) setCountdownOptions({
				circleColor: "#E53E3E",
				title: intl.get("time_to_start_donating"),
				timeTillDate: donateStart
			});
			else if(current < donateEnd) setCountdownOptions({
				circleColor: "#48BB78",
				title: intl.get("time_to_donation_end"),
				timeTillDate: donateEnd,
			});
			else if(current < genesisStart) setCountdownOptions({
				circleColor: "#E53E3E",
				title: intl.get("time_to_genesis_start"),
				timeTillDate: genesisStart,
			});
			else if(current < cliffEnd) setCountdownOptions({
				circleColor: "#E53E3E",
				title: intl.get("time_to_cliff_end"),
				timeTillDate: cliffEnd,
			});
			else if(current < releaseEnd) setCountdownOptions({
				circleColor: "#48BB78",
				title: intl.get("time_to_releasing_end"),
				timeTillDate: releaseEnd,
			});
			else setCountdownOptions({
				circleColor: "",
				title: "",
				timeTillDate: 0
			})
		}
		initCountdownOptions();
	}, [donateData, currentAccount])
	
	useEffect(() => {
		const setReleaseButton = async () => {
			const timestamp = await getGlobalTime();
			const donateStart = parseInt(donateData.startTimestamp);
			const donateEnd = parseInt(donateData.endTimestamp);
			const releaseStart = parseInt(donateData.genesisTimestamp);
			// const releaseEnd = parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff) + parseInt(donateData.duration);
			if(timestamp >= releaseStart) setShowReleaseButton(true);
			if(timestamp >= donateStart && timestamp <= donateEnd) setShowDonateButton(true);
		}
		if(donateData !== undefined) setReleaseButton();
	}, [donateData, currentAccount, redeemable])
	
	useEffect(() => {
		// console.log(priceForAmount)
		if(priceForAmount !== undefined) setDonationPrice({
			days: priceForAmount[0],
			rate: priceForAmount[1],
			tokens: priceForAmount[2]
		});
	}, [priceForAmount, currentAccount])
	
	useEffect(() => {
		if(beneficiaryCount === undefined) return;
		setProgressRate({
			sold: beneficiaryCount, // $$$$$$
			total: CAP,
			rate: beneficiaryCount / CAP * 100
		})
	}, [beneficiaryCount]);
	
	const col = useColorModeValue("black", "white");
	
	const copyclip = () => {
		if(currentAccount !== undefined) {
			toast({
				title: intl.get("donate"),
				description: intl.get("referal_url_is_copied"),
				status: 'success',
				duration: 3000,
				isClosable: true,
			})
		} else {
			toast({
				title: intl.get("donate"),
				description: intl.get("please_connect_wallet"),
				status: 'warning',
				duration: 3000,
				isClosable: true,
			})
		}
}
	
	return (
		<Stack
		spacing={{
			base: "8",
			lg: "6",
		}}
		>
		
		<Card>
		<Image borderRadius={"8"} src={banners[parseInt(props.id)]}/>
		</Card>
		
		{countdownOptions.timeTillDate === 0 ? <></> : 
		<Card
		textAlign={'center'} 
		justifyContent={'center'}
		w={"full"}
		p={5}
		>
		<Countdown 
		title={countdownOptions.title}
		timeTillDate={countdownOptions.timeTillDate}
		circleColor={countdownOptions.circleColor}
		fontColor={col}
		labelColor={col}
		/>
		</Card>}
		
		{showReleaseButton ? <></> :
		<Card
		textAlign={'center'}
		justifyContent={'center'}
		w={"full"}
		p={5}
		>
		<Box
		letterSpacing={'2px'}
		fontSize={"md"}
		fontWeight={220}
		pb={3}
		textTransform={"uppercase"}
		>{intl.get("progress")}</Box>
		<Progress
		w={"80%"}
		ml={"10%"}
		backgroundColor={"white"}
		value={progressRate.rate}
		borderColor={"gray.200"}
		borderWidth={1}
		colorScheme={"purple"}
		hasStripe={true}
		/>
		{progressRate === undefined ? <></> :
		<Box
		letterSpacing={'2px'}
		fontSize={"md"}
		mt={5}
		fontWeight={220}
		>{progressRate.sold + " / " + progressRate.total + " = " + progressRate.rate.toFixed(4) + "%"}</Box>}

		{donationPrice.tokens === undefined ? <></> :
		<Box
		letterSpacing={'2px'}
		fontSize={"md"}
		fontWeight={220}
		mt={5}
		textTransform={"uppercase"}
		>{`${intl.get("current_rate")}: ${format(ethers.utils.formatEther(donationPrice.tokens), 2)} NUSIC/100USDT`}</Box>}
		</Card>}
		
		{/* Binding referal relationship */}
		{props.id === "4" ? <></> :
		<AddReferer
		id={props.id}
		referer={props.referer}
		refererAddress={refererAddress === undefined || refererAddress === ZERO_ADDRESS ? props.referer : refererAddress}
		binded={refererAddress !== '' && refererAddress !== undefined && refererAddress !== ZERO_ADDRESS}
		currentAccount={currentAccount}
		/>}

		{/* Donating */}
		<Card textAlign={'center'} justifyContent={'center'}>
		<Heading alignItems={'center'} justifyContent={'center'} m={5} fontSize='md' fontWeight={220} letterSpacing='2px' textTransform='uppercase'>{intl.get("your_benefit")} (NUSIC)</Heading>
		<Text fontSize={'3xl'} fontWeight={300}>{format(ethers.utils.formatEther(beneficiaryData === undefined ? 0 : beneficiaryData.totalAmount), 2)}</Text>
		{beneficiaryData === undefined ? 
			showDonateButton ? 
			props.id === "4" ? 
			<InputDonateWithAddReferer
			rate={donationPrice.rate} 
			id={props.id}
			referer={props.referer} 
			refererAddress={refererAddress}
			currentAccount={currentAccount}/>
			:
			<InputDonate 
				rate={donationPrice.rate} 
				id={props.id}
				referer={props.referer} 
				refererAddress={refererAddress}
				currentAccount={currentAccount}/> :
			<></>
			: 
			<Text fontSize={'md'} fontWeight={220} mt={2} mb={1} ml={"5%"} mr={"5%"}>
			{"Donated 100 USDT x " + format(ethers.utils.formatEther((beneficiaryData.totalAmount).div(100)), 4) + " NUSIC/USDT"}
			</Text>}
			<Text fontSize={'md'} fontWeight={220} mt={2} mb={4} ml={"5%"} mr={"5%"}>
			{(beneficiaryData === undefined ? '' : "at " + DateTime.fromSeconds(parseInt(beneficiaryData.timestamp)).toFormat('F'))}</Text>
			</Card>
			
			<Card textAlign={'center'} justifyContent={'center'}>
			<Heading alignItems={'center'} justifyContent={'center'} mt={5} fontSize='md' fontWeight={220} letterSpacing='2px' textTransform='uppercase'>{intl.get("claimed")} (NUSIC)</Heading>
			{/* <Text mt={-3} ml={8}>{beneficiaryData === undefined ? <AiTwotoneCheckCircle color={"gray"}/> : beneficiaryData.status === 1 ? <AiTwotoneCheckCircle color={"#48BB78"}/> : <AiTwotoneCheckCircle color={"#E53E3E"}/>}</Text> */}
			
			<Text mt={2} fontSize={'3xl'} fontWeight={300}>{format(ethers.utils.formatEther(beneficiaryData === undefined ? 0 : beneficiaryData.releasedAmount), 2)}</Text>
			<Heading alignItems={'center'} justifyContent={'center'} m={3} fontSize='md' fontWeight={220} letterSpacing='2px' textTransform='uppercase'>{intl.get("claimable")} (NUSIC)</Heading>
			<Text mt={0} mb={2} fontSize={'3xl'} fontWeight={300}>{format(ethers.utils.formatEther(releasable === undefined ? 0 : releasable), 2)}</Text>
			
			{releasable > 0 && showReleaseButton ? 
				<Button 
				mb={5} 
				bg={"#7C04A8"}
				fontWeight={300}
				color={"white"}
				_hover={{bg: '#7C04A8'}}
				_active={{bg: '#7C04A8'}}
				onClick={() => {
					setModalOptions({
						message:`Do you want to claim ${format(ethers.utils.formatEther(releasable === undefined ? 0 : releasable), 2)} NUSIC?`, 
						buttonName: 'Claim', 
						fun: "release", 
					}); 
					onOpen();
				}}>{intl.get("claim")}
				</Button> : ''}
				</Card>
				
				{/* <Blur
				position={"absolute"}
				top={-10}
				left={-10}
				style={{ filter: "blur(120px)" }}
			/> */}
			
			{/* Referer link */}
			{props.referer === NO_REFERALS_TAG ? <></> : 
			<>
			<Card
			textAlign={'center'}
			justifyContent={'center'}
			w={"full"}
			p={5}
			>
			<Box
			letterSpacing={'2px'}
			fontSize={"md"}
			fontWeight={220}
			// pb={3}
			textTransform={"uppercase"}
			>{intl.get("my_referal_url")}</Box>
			<Box
			letterSpacing={'2px'}
			fontSize={"xs"}
			mt={3}
			fontWeight={220}
			>
			{referalUrl + currentAccount}
			</Box>
			<CopyToClipboard text={referalUrl + currentAccount} onCopy={() => copyclip()}>
			<Button
			fontFamily={'heading'}
			fontWeight={300}
			mb={2}
			mt={5}
			w={'full'}
			bg={"#7C04A8"}
			_hover={{bg: '#7C04A8'}}
			_active={{bg: '#7C04A8'}}
			color={'white'}
			// onClick={copyclip}
			>{intl.get("copy_referal_url")}</Button>
			</CopyToClipboard>
			</Card>

			{/* Team total members */}
			<Card
			textAlign={'center'}
			justifyContent={'center'}
			w={"full"}
			>
				<ReferalData currentAccount={currentAccount} id={props.id}/>
			</Card>

			{/* My referee list */}
			<RefereeList referer={currentAccount} id={props.id} />

			{/* Top referer list */}
			{/* <Card
			textAlign={'center'}
			justifyContent={'center'}
			w={"full"}
			>
				<TopList id={props.id}/>
			</Card> */}
			</>}

			<Card
			textAlign={'center'}
			justifyContent={'center'}
			w={"full"}
			>
			<InfoTableComponent id={props.id} />
			</Card>
			{donateData === undefined ? <></> :
			donateData.endTimestamp * 1000 < (new Date()).getTime() ? 
			<Card>
			<DonateStatus message={"Donation is end!"}/>					
			</Card> : (new Date()).getTime() < donateData.startTimestamp * 1000 ? 
			<Card>
			<DonateStatus message={"Donation has not started!"}/>					
			</Card> : beneficiaryData !== undefined && beneficiaryData.timestamp > 0 ? 
			<Card>
			<DonateStatus message={"This account has donated!"}/>
			</Card> : <></>
		}
		
		<Box height={1}></Box>
		<Modal 
		isOpen={isOpen} 
		onClose={onClose} 
		closeOnOverlayClick={false}
		isCentered
		>
		<ModalOverlay />
		<ModalContent>
		<ModalHeader>{modalOptions.buttonName}</ModalHeader>
		<ModalCloseButton />
		<ModalBody>
		{modalOptions.message}
		<Button
		fontFamily={'heading'}
		fontWeight={300}
		mb={2}
		mt={5}
		w={'full'}
		bg={"#7C04A8"}
		_hover={{bg: "#7C04A8"}}
		_active={{bg: "#7C04A8"}}
		color={'white'}
		onClick={modalOptions.fun === "release" ? release : null}
		isLoading={isLoading}
		isDisabled={isDisabled}
		>
		{modalOptions.buttonName}
		</Button>
		</ModalBody>
		</ModalContent>
		</Modal>
		</Stack>
		)
	}
			
