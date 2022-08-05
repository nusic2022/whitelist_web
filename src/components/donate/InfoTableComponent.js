import {useEffect, useState} from "react";
import { useDonate } from "contexts/DonateContext";
import { DateTime } from "luxon";
import { ethers } from "ethers";
import { tokenVestingAddress, NUSIC_TOKEN_ADDRESS, SCAN_BASE_URL } from "constants";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { shortAddress } from "../../utils/format";

import { 
	Box,
	Table,
	Tbody,
	Tr,
	Td,
	useColorModeValue
} from '@chakra-ui/react'
import intl from '../../utils/intl';

export const InfoTableComponent = (props) => { 
	const { donateData } = useDonate()
	// if(donateData === undefined) return (<></>);	
	const [donateDataObj, setDonateDataObj] = useState(null);
	
	useEffect(() => {
		if(donateData === undefined) return;
		const genesisTimestamp = DateTime.fromSeconds(parseInt(donateData.genesisTimestamp)).toFormat("F");
		const cliffTimeStamp = DateTime.fromSeconds(parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff)).toFormat("F");
		const startTime = DateTime.fromSeconds(parseInt(donateData.startTimestamp)).toFormat("F");
		const endTime = DateTime.fromSeconds(parseInt(donateData.endTimestamp)).toFormat("F");
		const endDuration = DateTime.fromSeconds(parseInt(donateData.genesisTimestamp) + parseInt(donateData.cliff) + parseInt(donateData.duration)).toFormat("F");
		const tgeAmount = donateData.tgeAmountRatio.div(100) + "%";	
		const eraBasis = donateData.eraBasis.div(3600).toString();
		const highest = ethers.utils.formatEther(donateData.highest);
		const lowest = ethers.utils.formatEther(donateData.lowest);	

		setDonateDataObj({
			genesisTimestamp,
			cliffTimeStamp,
			startTime,
			endTime,
			endDuration,
			tgeAmount,
			eraBasis,
			highest,
			lowest,
		})
	}, [donateData]);
	
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
		textTransform={"uppercase"}
		>{intl.get("rules")}
		</Box>
		<Table 
		ml={"5%"} 
		mr={"5%"} 
		width={"90%"} 
		variant="simple" 
		color={useColorModeValue('black.700', '#dcdcdc')}
		wordBreak={"break-word"}
		fontSize={"sm"}
		fontWeight={220}
		textTransform={"uppercase"}
		>
		{donateDataObj === null ? <></> :
		<Tbody>
		<Tr>
		<Td>{intl.get("nusic_contract")}</Td>
		<Td textTransform={"none"}><a href={SCAN_BASE_URL + NUSIC_TOKEN_ADDRESS} target="_blank" rel="noreferrer">{shortAddress(NUSIC_TOKEN_ADDRESS) + " "}<ExternalLinkIcon/></a></Td>
		</Tr>
		<Tr>
		<Td>{intl.get("whitelist_contract")}</Td>
		<Td textTransform={"none"}><a href={SCAN_BASE_URL + tokenVestingAddress[props.id]} target="_blank" rel="noreferrer">{shortAddress(tokenVestingAddress[props.id]) + " "}<ExternalLinkIcon /></a></Td>
		</Tr>
		<Tr>
		<Td>{intl.get("donate_duration")}</Td>
		<Td>{donateDataObj.startTime} - {donateDataObj.endTime}</Td>
		</Tr>
		{/* <Tr>
		<Td>{intl.get("genesis_time")}</Td>
		<Td>{donateDataObj.genesisTimestamp}</Td>
		</Tr> */}
		{/* {parseInt(donateData.cliff) === 0 ? <></> : 
		<Tr>
		<Td>{intl.get("cliff")}</Td>
		<Td>{donateData === undefined ? "" : parseInt(donateData.cliff) === 0 ? `NO` : `${donateDataObj.genesisTimestamp} - ${donateDataObj.cliffTimeStamp}`}</Td>
		</Tr>
		} */}
		<Tr>
		<Td>{intl.get("claim_duration")}</Td>
		<Td>{`${donateDataObj.cliffTimeStamp} - ${donateDataObj.endDuration}`}</Td>
		</Tr>
		{parseInt(props.id) === 2 ? 
		// ######
		<Tr>
		<Td>{intl.get("tge_ratio")}</Td>
		<Td>{"36%"}</Td>
		</Tr> :
		<Tr>
		<Td>{intl.get("tge_ratio")}</Td>
		<Td>{donateDataObj.tgeAmount}</Td>
		</Tr>}
		<Tr>
		<Td>{intl.get("release_start")}</Td>
		<Td>{`${donateDataObj.genesisTimestamp}`}</Td>
		</Tr>
		<Tr>
		<Td>{intl.get("era_period")}</Td>
		<Td> {donateDataObj.eraBasis + " " + (donateDataObj.eraBasis > 1 ? 'hours' : 'hour')} </Td>
		</Tr>
		<Tr>
		<Td>{intl.get("donation_amount")}</Td>
		<Td>{donateDataObj.lowest === donateDataObj.highest ? donateDataObj.lowest : donateDataObj.lowest + " - " + donateDataObj.higest} USDT</Td>
		</Tr>
		</Tbody>}
		</Table>
		</Box>
		);
	};
