import {useState, useEffect} from 'react';
import {
    Box,
    Container,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    getNetworkConfig,
} from 'constants';
  
function shortenAddress(address) {
    return address !== undefined ? address.substr(0, 8) + "..." + address.substr(address.length - 6, 6) : '';
}

export default function AddressFooter(props) {
    const [networkConfig, setNetworkConfig] = useState(null);

    useEffect(() => {
        setNetworkConfig(getNetworkConfig(props.chainId));
    }, [networkConfig, props.chainId])

    return (
        <Box 
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}>
        {networkConfig !== null && networkConfig !== undefined? 
        <Container
            as={Stack}
            maxW={'6xl'}
            py={10}
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}>
            <Text>Contract Addresses: </Text>
            
						<Text>Token Address: {""}
                <Link href={networkConfig.etherscanBaseUrl + networkConfig.paymentTokens[0].address}
                isExternal mr="1">{shortenAddress(networkConfig.paymentTokens[0].address)}  {""}<ExternalLinkIcon /></Link>
            </Text>
        </Container>
        : <></>}
        </Box>
    );
}