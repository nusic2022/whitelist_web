import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import {
	Box, chakra, Container, HStack, Image, Stack, Text, useColorModeValue,
	VisuallyHidden,
} from '@chakra-ui/react';
import { 
	// FaDiscord, 
	FaTwitter, 
	// FaTelegramPlane, 
	// FaGithub, 
	// FaMedium 
} from 'react-icons/fa';
import Logo from "assets/logo.png"

const SocialButton = ({
	children,
	label,
	href,
}) => {
	return (
		<chakra.button
		bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
		rounded={'full'}
		w={8}
		h={8}
		cursor={'pointer'}
		as={'a'}
		href={href}
		display={'inline-flex'}
		alignItems={'center'}
		justifyContent={'center'}
		transition={'background 0.3s ease'}
		_hover={{
			bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
		}}
		>
		<VisuallyHidden>{label}</VisuallyHidden>
		{children}
		</chakra.button>
		);
	};
	
	export default function Footer() {
		return (
			<Box
			bg={useColorModeValue('white', 'gray.900')}
			color={useColorModeValue('gray.700', 'gray.200')}>
			<Container as={Stack} maxW={'6xl'} py={4} spacing={4} justify={'center'} align={'center'}>
			<RouterLink to="/" style={{textDecoration: 'none'}}>
			<HStack>
			<Image src={Logo} h="50px"/> 
			<chakra.h1 fontSize="22px" fontWeight={220} letterSpacing="4px" ml="2" color="#450F76">
			NUSIC
			</chakra.h1>
			</HStack>
			</RouterLink>
			</Container>
			<Box
			borderTopWidth={1}
			borderStyle={'solid'}
			borderColor={useColorModeValue('gray.200', 'gray.700')}>
			<Container
			as={Stack}
			maxW={'6xl'}
			py={4}
			direction={{ base: 'column', md: 'row' }}
			spacing={4}
			justify={{ base: 'center', md: 'space-between' }}
			fontWeight={220}
			letterSpacing="2px"
			align={{ base: 'center', md: 'center' }}>
			<Text>© 2022 Nusic. All rights reserved</Text>
			<Stack direction={'row'} spacing={6}>
			<SocialButton label={'Twitter'} href={'https://twitter.com/nusic'}>
			<FaTwitter />
			</SocialButton>
			</Stack>
			</Container>
			</Box>
			</Box>
			);
		}