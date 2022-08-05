import {useEffect, useState} from "react";
import { SCAN_BASE_URL, API_BASE_URL } from "constants";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {call} from "../../utils/api";

import { 
	Box,
	Table,
	Tbody,
	Tr,
	Td,
	useColorModeValue
} from '@chakra-ui/react'
import intl from '../../utils/intl';
import { shortAddress } from "../../utils/format";

export const TopList = (props) => { 
	const [topListData, setTopListData] = useState([]);

	useEffect(() => {
		async function getData() {
			const d = await call(API_BASE_URL + "getTopReferers", {team: props.id});
			if(d.data.success) setTopListData(d.data.data);
		}
		getData();
	}, [props.id]);
	
	return (
		<Box
		pt={5}
		pb={5}
		mb={5} 
		>
		<Box
		letterSpacing={'2px'}
		fontSize={"md"}
		fontWeight={220}
		// pb={3}
		textTransform={"uppercase"}
		>{intl.get("top_list")}
		</Box>

		<Table 
		ml={"3%"} 
		mr={"2%"} 
		width={"95%"} 
		variant="simple" 
		color={useColorModeValue('black.700', '#dcdcdc')}
		fontSize={"sm"}
		fontWeight={220}
		textTransform={"uppercase"}
		>
		{topListData === undefined || topListData.length === 0 ? <></> :
		<Tbody>
		<Tr>
			<Td>{intl.get("toplist_no")}</Td>
			<Td>{intl.get("toplist_address")}</Td>
			<Td>{intl.get("toplist_number")}</Td>
		</Tr>
		{topListData.list.map((v, k) => 
		<Tr
		whiteSpace={"nowrap"}
		key={k}>
		<Td>{k + 1}</Td>
		<Td><a href={SCAN_BASE_URL + v.referer} target="_blank" rel="noreferrer">{shortAddress(v.referer) + " "}<ExternalLinkIcon/></a></Td>
		<Td>{v.count}</Td>
		</Tr>
		)}
		</Tbody>}
		</Table>
		</Box>
		);
	};
