import React, { useState, useEffect} from "react";
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
	InputLeftAddon,
} from '@chakra-ui/react';
import { NO_REFERALS_TAG } from "constants";
import { ethers } from "ethers";
import intl from '../../utils/intl';
import { Card } from '../common/Card';
import { BindModal } from './BindModal';

export const AddReferer = (props) => {
	const [referer, setReferer] = useState(props.referer);
	const toast = useToast()
	const { isOpen, onOpen, onClose } = useDisclosure()
	// console.log(props.binded, props.referer)
	const openAddModal = () => {
		console.log(referer);
		if(referer === undefined || referer === '' || referer === "0") {
			toast({
				title: intl.get("bind"),
				description: intl.get("please_input_referer_address"),
				status: 'warning',
				duration: 4000,
				isClosable: true,
			})
		} else if(props.currentAccount.toLowerCase() === referer.toLocaleLowerCase()) {
			toast({
				title: intl.get("bind"),
				description: intl.get("cannot_self_refer"),
				status: 'warning',
				duration: 4000,
				isClosable: true,
			})
			return;
		} else {
			onOpen();
		}
	}

	useEffect(() => {
		// console.log(props.binded);
		if(props.referer !== "" && props.referer !== undefined) {
			try {
				if(props.referer === NO_REFERALS_TAG || props.binded) {}
				else setReferer(ethers.utils.getAddress(props.referer));
			} catch(err) {
				toast({
					title: "Error",
					description: intl.get("refer_must_available"),
					status: 'error',
					duration: 4000,
					isClosable: true,
				})
				return;
			}	
		} 
	}, [props.binded, props.referer, toast])

	return(
	<Card textAlign={'center'} justifyContent={'center'}>
		<Box
		justifyContent={"center"}
		textAlign={"center"}
		mt={5}
		pb={5}
		pl={"5%"}
		pr={"5%"}
		fontWeight={220}
		>
		<HStack 
		maxW="full"
		mb={3}
		mt={8}
		color={useColorModeValue('black', '#dcdcdc')}
		>
			<InputGroup>
			<InputLeftAddon children={intl.get("ref")} />
			<Input fontWeight={300} value={props.binded ? props.refererAddress : referer} onChange={(e) => setReferer(e.target.value)} placeholder={intl.get("leave_empty_no_referer")}/>
			</InputGroup>
		</HStack>
		{props.binded ? <>{intl.get("binded")}</> :
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
		onClick={openAddModal}
		>
		{intl.get("bind")}
		</Button>}
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
		<BindModal 
			id={props.id}
			referer={referer}
			onSuccess={()=> window.location.reload()}
			onClose={()=> onClose()}
		/>
		</ModalBody>
		</ModalContent>
		</Modal>

	</Card>
	)
}