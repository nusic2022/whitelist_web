import React, { useState} from "react";
import {
	Box,
	Button,
	useColorModeValue,
	useToast,
	HStack,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	InputGroup,
	InputRightAddon,
} from '@chakra-ui/react'
import { IDO_AMOUNT, ZERO_ADDRESS } from "constants";
import intl from '../../utils/intl';
import { DonateModal } from './DonateModal.js';
import {format} from '../../utils/format';

export const InputDonate = (props) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [amount, setAmount] = useState(IDO_AMOUNT);
	const {rate} = props;
	const toast = useToast();

	const openDonateModal = () => {
		if(props.currentAccount === undefined) {
			toast({
				title: intl.get("donate"),
				description: intl.get("please_connect_wallet"),
				status: 'warning',
				duration: 4000,
				isClosable: true,
			})
			return;
		} else if((props.refererAddress === undefined || props.refererAddress === ZERO_ADDRESS) && props.id !== '4') {
			// If no refererAddress and not team 4, can not donate.
			toast({
				title: intl.get("donate"),
				description: intl.get("please_donate_after_binding"),
				status: 'warning',
				duration: 4000,
				isClosable: true,
			})
			return;
		} else {
			onOpen();
		}
	}

	return (
		<>
		<Box
		justifyContent={"center"}
		textAlign={"center"}
		mt={5}
		pl={"5%"}
		pr={"5%"}
		fontWeight={220}
		>
		<HStack 
		maxW="full"
		mb={3}
		color={useColorModeValue('black', '#dcdcdc')}
		>
		<InputGroup>
		<Input fontWeight={300} value={IDO_AMOUNT} isReadOnly={true} onChange={(e) => setAmount(e.target.value)}/>
		<InputRightAddon children='USDT' />
		</InputGroup>
		</HStack>
		
		<Button
		fontFamily={"heading"}
		fontWeight={300}
		mt={5}
		mb={3}
		w={"full"}
		bg={"#7C04A8"}
		_hover={{bg: "#7C04A8"}}
		_active={{bg: "#7C04A8"}}
		color={"white"}
		onClick={openDonateModal}
		>
		{intl.get("donate")}
		</Button>
		</Box>
		<Modal 
		isOpen={isOpen} 
		onClose={onClose} 
		closeOnOverlayClick={false}
		isCentered
		>
		<ModalOverlay />
		<ModalContent>
		<ModalHeader>{intl.get("confirmation")}</ModalHeader>
		<ModalCloseButton />
		<ModalBody>
		<DonateModal 
			amount={amount} 
			id={props.id}
			referer={''}
			rate={format(amount / rate * 1000, 4)}
			onSuccess={()=> window.location.reload()}
			onClose={()=> onClose()}
		/>
		</ModalBody>
		</ModalContent>
		</Modal>
		</>
		);
	};
