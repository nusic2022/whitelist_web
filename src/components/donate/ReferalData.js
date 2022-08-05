import {useEffect, useState} from "react";
import { API_BASE_URL, DEFAULT_LEVELS } from "constants";
import {call} from "../../utils/api";

import { 
	Box, Text
} from '@chakra-ui/react'
import intl from '../../utils/intl';

export const ReferalData = (props) => { 
	const [allRefereeCount, setAllRefereeCount] = useState(0);
	const [allFundedCount, setAllFundedCount] = useState(0);
	// const [allRefereeList, setAllRefereeList] = useState([]);

	useEffect(() => {
		async function getData() {
			if(props.currentAccount === undefined) {
				setAllRefereeCount(1);
				return;
			}
			const d = await call(API_BASE_URL + "getAllReferee", {address: props.currentAccount, levels: DEFAULT_LEVELS, team: props.id});
			if(d.data.success) {
				// setAllRefereeList(d.data.data.list);
				setAllRefereeCount(d.data.data.count);
				setAllFundedCount(d.data.data.fundedCount);
			}
		}
		getData();
	}, [props.currentAccount, props.id]);
	
	return (
		<Box
		pt={5}
		pb={5}
		mb={1} 
		>
		<Box
		letterSpacing={'2px'}
		fontSize={"md"}
		fontWeight={220}
		textTransform={"uppercase"}
		>{intl.get("team_count")}
		</Box>
		<Text fontSize={'3xl'} mt={1} fontWeight={300}>{allRefereeCount - 1}</Text>
		<Box
		letterSpacing={'2px'}
		fontSize={"md"}
		fontWeight={220}
		textTransform={"uppercase"}
		mt={3}
		>{intl.get("team_funded_count")}
		</Box>
		<Text fontSize={'3xl'} mt={1} fontWeight={300}>{allFundedCount - 1}</Text>
		</Box>
		);
	};
