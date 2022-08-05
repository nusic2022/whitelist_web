import React, { useState } from "react";
import { 
	Box, 
	useColorModeValue, 
	Button, 
	useToast, 
	Stat, 
	StatHelpText, 
} from "@chakra-ui/react";
import donateABI from "abi/Whitelist_abi";
import { tokenVestingAddress, getNetworkConfig, ZERO_ADDRESS } from "constants";
import ConfirmationProgress from '../ConfirmationProgress';
import { ethers } from "ethers";
import { useAuth } from "../../contexts/AuthContext";
import intl from "../../utils/intl";

export const BindModal = (props) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
	const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: intl.get("start"), step: 1});
	const { currentAccount, currentNetwork } = useAuth()
	const toast = useToast()
	const { referer, id } = props;
	// console.log(amount, rate, referer);

	const bind = async() => {
		if (!currentAccount || !currentNetwork) {
			toast({
				title: intl.get("bind"),
				description: intl.get("please_connect_wallet"),
				status: "warning",
				duration: 3000,
				isClosable: true
			});
			setTimeout(() => props.onClose(), 1000);
			return;
		};
		const networkConfig = getNetworkConfig(currentNetwork);
		
		setIsLoading(true);
		try {
			const { ethereum } = window; //injected by metamask
			const provider = new ethers.providers.Web3Provider(ethereum); 
			const signer = provider.getSigner(); 
			// console.log('address', id, tokenVestingAddress[id])
			const TokenVestingContract = new ethers.Contract(tokenVestingAddress[id], donateABI, signer);

			try {
				setHiddenConfirmationProgress(false);
				setConfirmationProgressData({step: '1/3', value: 30, message: intl.get("start")});
				const _referer = referer === '' || referer === undefined ? ZERO_ADDRESS : ethers.utils.getAddress(referer);

				const tx = await TokenVestingContract.addReferer(_referer);
				toast({
					title: intl.get("bind"),
					description: `${intl.get("waiting_for_confirmation")}, hash: ${tx.hash}`,
					status: 'warning',
					duration: 4000,
					isClosable: true,
				});
				
				setConfirmationProgressData({step: '2/3', value: 67, message: intl.get("waiting_for_confirmation")});
				await tx.wait(networkConfig.confirmationNumbers);
				setConfirmationProgressData({step: '3/3', value: 100, message: intl.get("transactions_done")});
				
				toast({
					title: intl.get("bind"),
					description: intl.get("bind_successfull"),
					status: 'success',
					duration: 3000,
					isClosable: true,
				})

				setTimeout(() => {
					// setHiddenConfirmationProgress(true);
					// setIsLoading(false);
					// setIsDonated(true);	
					props.onSuccess();
				}, 4000);
			} catch(err) {
				console.log(err);
				toast({
					title: `${intl.get("bind")} Error`,
					description: `${err.data.message}`,
					status: 'error',
					duration: 4000,
					isClosable: true,
				})
				setIsLoading(false);
			}
		} catch(err) {
			console.log('Error Binding Modal', err)
			setIsLoading(false);
		}
		
	}
	
	return (
		<Box
		bg={useColorModeValue("white", "gray.700")}
		w="full"
		alignItems="center"
		justifyContent="center"
		direction={"column"}
		fontWeight={220}
		>
		
		<Box
		bg={useColorModeValue("white", "gray.700")}
		maxW="sm"
		justifyContent={'center'}
		alignItems={'center'}
		>
		<Stat>
		{referer === "" || referer === undefined ? <></> :
		<StatHelpText>{intl.get("your_referer_account") + ": " + referer}</StatHelpText>}
		</Stat>
		
		<Button
		fontFamily={'heading'}
		fontWeight={300}
		mb={2}
		mt={2}
		w={'full'}
		bg={"#7C04A8"}
		// bgGradient="linear(to-r, red.400,pink.400)"
		color={'white'}
		_hover={{bg: "#7C04A8"}}
		_active={{bg: "#7C04A8"}}
		onClick={() => bind()}
		isLoading={isLoading}
		>
		{intl.get("bind")}
		</Button>
		
		
		</Box>
		<ConfirmationProgress 
		hidden={hiddenConfirmationProgress}
		step={confirmationProgressData.step}
		value={confirmationProgressData.value}
		message={confirmationProgressData.message}
		/>
		</Box>
		)
	}
	
	