import donateABI from "abi/Whitelist_abi";
import { tokenVestingAddress } from "constants";

import { ethers } from "ethers";

const { ethereum } = window; //injected by metamask
//connect to an ethereum node
const provider = new ethers.providers.Web3Provider(ethereum); 
//gets the account
const signer = provider.getSigner(); 

const tokenVestingContract = (contractId) => new ethers.Contract(
    tokenVestingAddress[contractId],
    donateABI, 
    signer
  );

export const loadCrowdFundingParams = async (contractId) => {
    const response = await tokenVestingContract(contractId).crowdFundingParams();
    return response
}

export const totalDonateAmount = async (contractId) => {
    const response = await tokenVestingContract(contractId).total();
    return response
}

export const loadTotalParticipant = async (contractId) =>  {
    const response = await tokenVestingContract(contractId).total();
    return response;
}

export const loadBeneficiaryCount = async (contractId) =>  {
    const response = await tokenVestingContract(contractId).getBeneficiaryCount();
    return response
}

export const loadIndex = async (contractId, address) => {
    if(address === undefined) return;
    const response = await tokenVestingContract(contractId).getIndex(address);
    return response
}

export const loadBeneficiary = async (contractId, index) => await tokenVestingContract(contractId).getBeneficiary(index);

/**
 * Get all beneficiary count
 */
export const loadBeneficiaryCountAll = async (contractId) => await tokenVestingContract(contractId).getBeneficiary();

/**
 * Get estimated rate for the given amount
 */
export const loadPriceForAmount = async (contractId, amount) => await tokenVestingContract(contractId).getCurrentRate(amount);

export const loadRefererAddress = async (contractId, address) => await tokenVestingContract(contractId).getReferer(address);

/**
 * Get releasable amount
 * @returns 
 */
export const loadReleasable = async (contractId, address) => {
    if(address === undefined) return;
    const res = await loadIndex(contractId, address);
    if(res[0]) return await tokenVestingContract(contractId).releasable(res[1].toString());
    else return 0;
}
