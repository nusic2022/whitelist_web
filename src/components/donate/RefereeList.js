import React, { useState, useEffect} from "react";
import {
	Box,
	useColorModeValue,
	Table,
	Td,
	Tr,
	Tbody,
	Divider
} from '@chakra-ui/react';
import { API_BASE_URL, SCAN_BASE_URL } from "constants";
import intl from '../../utils/intl';
import { Card } from '../common/Card';
import {call} from "../../utils/api";
import { shortAddress } from "../../utils/format";
import { ExternalLinkIcon, CheckIcon, TimeIcon } from "@chakra-ui/icons";
import { format } from "../../utils/format";
import { ethers } from "ethers";

export const RefereeList = (props) => {
	const [list, setList] = useState([]);
	const [layer2Count, setLayer2Count] = useState(0);
	const [layer2FundedCount, setLayer2FundedCount] = useState(0);
	
	useEffect(() => {
		async function getData() {
			const d = await call(API_BASE_URL + "getDirectReferee", {address: props.referer, team: props.id});
			// console.log(d.data.data.list)
			if(d.data.success) setList(d.data.data.list);
			const _layer2Count = await call(API_BASE_URL + "getAllReferee", {address: props.referer, levels: 2, team: props.id});
			// console.log(_layer2Count);
			if(_layer2Count.data.success) {
				setLayer2Count(_layer2Count.data.data.count - 1);
				setLayer2FundedCount(_layer2Count.data.data.fundedCount - 1);
			}
		}
		getData();
	}, [props.id, props.referer]);

	return(
		<Card textAlign={'center'} justifyContent={'center'}>
		<Box
		pt={5}
		pb={5}
		mb={5} 
		>

		<Box mb={3} fontWeight={220} fontSize={"md"}>
			{intl.get('direct_referal_total') + list.length}
		</Box>

		<Box mb={3} fontWeight={220} fontSize={"md"}>
			{intl.get('layer2_referal_total') + (layer2Count - list.length)}
		</Box>
		{/* <Box mb={3} fontWeight={220} fontSize={"md"}>
			{intl.get('layer2_funded_total') + (layer2FundedCount - list.length)}
		</Box> */}

		<Divider
			color={useColorModeValue('black.700', '#dcdcdc')}
			mb={3}
			w={"60%"}
			ml={"20%"}
		/>
		<Box
		letterSpacing={'2px'}
		fontSize={"md"}
		fontWeight={220}
		// pb={3}
		textTransform={"uppercase"}
		>{intl.get("my_referee_list")}
		</Box>

		<Table 
		width={"100%"}
		variant="simple" 
		color={useColorModeValue('black.700', '#dcdcdc')}
		fontSize={"sm"}
		fontWeight={220}
		textTransform={"uppercase"}
		mt={5}
		>
		<Tbody>
		<Tr>
			<Td>{intl.get("toplist_address")}</Td>
			<Td>{intl.get("referee_status")}</Td>
			<Td>{intl.get("referee_amount")}</Td>
		</Tr>
		{list.map((v, k) => 
		<Tr
		whiteSpace={"nowrap"}
		key={k}>
		<Td><a href={SCAN_BASE_URL + v.referee} target="_blank" rel="noreferrer">{shortAddress(v.referee) + " "}<ExternalLinkIcon/></a></Td>
		<Td>{v.amount > 0 ? <CheckIcon/> : <TimeIcon/>}</Td>
		<Td>{format(ethers.utils.formatEther(v.amount === '' ? 0 : v.amount), 2)}</Td>
		</Tr>
		)}
		</Tbody>
		</Table>

		{list === undefined || list.length === 0 ? 
		<Box
			fontSize={"sm"}
			fontWeight={220}
			mt={3}
		>
			{intl.get('no_referee')}
		</Box> : <></>}

		</Box>
		</Card>
	)
}