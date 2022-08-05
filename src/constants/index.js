/**
 * Rinkeby testnet
 */
// export const TOKEN_VESTING_ADDRESS = '0xf685D057924edd44E1236eC837F4b9522E46F92B'; // updated on 4-30
// export const NUSIC_TOKEN_ADDRESS = "0xF3a7f88d2cfFa47b670E36f93f493BbF98c02e52";
// export const USDT_TOKEN_ADDRESS = "0x014Eed0cb456FF95992A79D51ff7169ec44a5cFc"; // use cpt for development
// export const CAP = '300000000000000000000000'; // Cap for NUSIC
// export const CHAIN_ID = 4;
// export const SCAN_BASE_URL = 'https://rinkeby.etherscan.io/address/';
// export const IDO_AMOUNT = 100;

/**
 * BSC Mainnet
 */
// export const TOKEN_VESTING_ADDRESS = '0x81B855B3b75a3FB8592281DcD51408D511Fe9A57'; // updated on July.7
export const NUSIC_TOKEN_ADDRESS = "0x7E58a5c150B3C9171100FDeE0Dd22Ee666dB9545";
export const USDT_TOKEN_ADDRESS = "0x55d398326f99059ff775485246999027b3197955"; // BSC-USDT
export const CAP = 15000; // Cap for NUSIC
export const CHAIN_ID = 56;
export const SCAN_BASE_URL = 'https://bscscan.com/address/';
export const IDO_AMOUNT = 100;
export const NO_REFERALS_TAG = '5';

export const supportedChainIds = [56];
// export const API_BASE_URL = 'http://localhost:8088/api/v1/';
export const API_BASE_URL = 'https://api2.nusic.vip:8443/api/v1/';
export const DEFAULT_LEVELS = 20;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const tokenVestingAddress = [
	'0x81B855B3b75a3FB8592281DcD51408D511Fe9A57', // original
	'0x292a6516512020794eb19BEb18A30bA77119e1cC', // team#1
	'0x90356d9ebAdCdcDc44a7Ce90E3248f85082ea008', // team#2
	'0x812F6D643e3A1D2aF6e8F055ABfe1C4966053551', // team#3
	'0xFB796FE2445E96Cf4E6a87E696e68bd78Db774cF', // team#4
];

export const banners = [
	'https://tva1.sinaimg.cn/large/e6c9d24egy1h4go0buw3gj20p00dwdhn.jpg', // original
	'https://tva1.sinaimg.cn/large/e6c9d24egy1h4go0buw3gj20p00dwdhn.jpg', // team#1
	'https://tva1.sinaimg.cn/large/e6c9d24egy1h3xbm5u2cwj21ko0u0dje.jpg', // team#2
	'https://tva1.sinaimg.cn/large/e6c9d24egy1h3xbm5u2cwj21ko0u0dje.jpg', // team#3
	'https://tva1.sinaimg.cn/large/e6c9d24egy1h3xbm5u2cwj21ko0u0dje.jpg', // team#4
]
export const netWorkConfig = [{
	chainId: 56,
	chainName: "Binance Smart Chain",
	supportChainlinkVRFV2: true,
	tokenVestingAddress: '',
	paymentTokens: [{
		// The main token USDT must be the first
		address: '0xa747Ba9BbF79E165Cd71c4376B72eBc06CA735CB',
		symbol: 'USDT',
	}],
	etherscanBaseUrl: 'https://bscscan.com/address/',
	// tokenName: 'BNB',
	confirmationNumbers: 1,
}, {
	chainId: 4,
	chainName: 'Rinkeby',
	supportChainlinkVRFV2: true,
	tokenVestingAddress: '',
	paymentTokens: [{
		// The main token USDT must be the first
		address: '0x014Eed0cb456FF95992A79D51ff7169ec44a5cFc',
		symbol: 'CPT',
	}],
	etherscanBaseUrl: 'https://rinkeby.etherscan.io/address/',
	// tokenName: 'ETH',
	confirmationNumbers: 1,
}];

export const getNetworkConfig = (chainId) => 
	netWorkConfig.filter((item) => parseInt(item.chainId) === parseInt(chainId))[0];

export const supportedNetworks = () => 
	netWorkConfig.filter((item) => supportedChainIds.includes(parseInt(item.chainId)));

export const supportedChainNames = () => 
	supportedNetworks().map((item, index) => item.chainName);
