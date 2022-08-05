import React from "react";
import {
	Box,
} from '@chakra-ui/react'
export const DonateStatus = (props) => {
	return (
		<Box
		justifyContent={"center"}
		textAlign={"center"}
		as={"form"}
		p={5}
		mt={2}
		ml={20}
		mr={20}
		mb={10}
		>
		<Box fontSize={"3xl"} fontWeight={220} mb={10} color={"#7C04A8"}>{props.message}</Box>
		</Box>
		)
}
