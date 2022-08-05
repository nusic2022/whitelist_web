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
import erc20ABI from "abi/ERC20_abi";
import { tokenVestingAddress, USDT_TOKEN_ADDRESS, getNetworkConfig, ZERO_ADDRESS } from "constants";
import ConfirmationProgress from '../ConfirmationProgress';
import { ethers } from "ethers";
import { useAuth } from "../../contexts/AuthContext";
import intl from "../../utils/intl";

export const DonateModal = (props) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ hiddenConfirmationProgress, setHiddenConfirmationProgress] = useState(true);
	const [ confirmationProgressData, setConfirmationProgressData ] = useState({value: 5, message: intl.get("start"), step: 1});
	const { currentAccount, currentNetwork } = useAuth()
	const toast = useToast()
	const { amount, rate, referer, id } = props;
	// console.log(amount, rate, referer);

	const sendDonate = async() => {
		if (!currentAccount || !currentNetwork) {
			toast({
				title: intl.get("donate"),
				description: intl.get("please_connect_wallet"),
				status: "warning",
				duration: 3000,
				isClosable: true
			})
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
			const ERC20Contract = new ethers.Contract(USDT_TOKEN_ADDRESS, erc20ABI, signer);

			try {
				setHiddenConfirmationProgress(false);
				setConfirmationProgressData({step: '1/4', value: 20, message: intl.get("start")});
				const _amount = ethers.utils.parseEther((amount).toString());
				const _referer = referer === '' || referer === undefined ? ZERO_ADDRESS : ethers.utils.getAddress(referer);

				const _balance = await ERC20Contract.balanceOf(currentAccount);
				if(_balance < _amount) {
					toast({
						title: intl.get("donate"),
						description: intl.get("usdt_not_enough"),
						status: 'warning',
						duration: 3000,
						isClosable: true,
					})
					// setHiddenConfirmationProgress(true);
					// setIsLoading(false);
					setTimeout(() => props.onClose(), 1000);
					return;
				}
				const _allowance = await TokenVestingContract.getAllowance();
				if(_allowance < _amount) {
					const tx = await ERC20Contract.approve(tokenVestingAddress[id], _amount);
					toast({
						title: intl.get("donate"),
						description: intl.get("approving_whitelist_contract"),
						status: 'warning',
						duration: 4000,
						isClosable: true,
					});
					setConfirmationProgressData({step: '2/4', value: 50, message: intl.get("waiting_for_approving")});
					await tx.wait(networkConfig.confirmationNumbers);
				}

				const tx = await TokenVestingContract.crowdFunding(_amount, _referer);
				toast({
					title: intl.get("donate"),
					description: `${intl.get("waiting_for_confirmation")}, hash: ${tx.hash}`,
					status: 'warning',
					duration: 4000,
					isClosable: true,
				});
				
				setConfirmationProgressData({step: '3/4', value: 75, message: intl.get("waiting_for_confirmation")});
				await tx.wait(networkConfig.confirmationNumbers);
				setConfirmationProgressData({step: '4/4', value: 100, message: intl.get("transactions_done")});
				
				toast({
					title: intl.get("donate"),
					description: intl.get("donate_successfull"),
					status: 'success',
					duration: 3000,
					isClosable: true,
				})
				setTimeout(() => {
					props.onSuccess();
				}, 4000);
			} catch(err) {
				console.log(err);
				toast({
					title: `${intl.get("donate")} Error`,
					description: `${err.data.message}`,
					status: 'error',
					duration: 4000,
					isClosable: true,
				})
				setIsLoading(false);
				setTimeout(() => props.onClose(), 1000);
			}
		} catch(err) {
			console.log('Error Donate Modal', err)
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
		<Box>{intl.get("you_will_donate")}</Box>
		<Box fontSize={"xl"} fontWeight={300}>{amount} USDT</Box>
		<StatHelpText>{intl.get("and_get") + " " + rate} NUSICs</StatHelpText>
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
		onClick={() => sendDonate()}
		isLoading={isLoading}
		>
		{intl.get("donate")}
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
	
