import React, { useState, useEffect } from "react";
// import ToggleTheme from "utils/ToggleTheme";
import Logo from 'assets/logo.png'
import { Link as RouterLink } from "react-router-dom";
import {
  chakra, Box, Flex, useColorModeValue, VisuallyHidden, HStack,
  useDisclosure, VStack, IconButton, CloseButton, Image, Alert,
  AlertIcon, AlertTitle, AlertDescription
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "contexts/AuthContext";
import LoginButton from "components/LoginButton";
import { supportedChainNames, supportedChainIds } from '../constants';

export default function NavBar(props) {
  const bg = useColorModeValue("white", "gray.800");
  const mobileNav = useDisclosure();

  // const [ path, setPath ] = useState("");
  const { currentNetwork } = useAuth();
  const [ shadow, setShadow ] = useState("");
	const [ logoColor, setLogoColor] = useState("#fff");
	// const networkConfig = getNetworkConfig(currentNetwork);

  const handleScroll = () => {
      if(window.pageYOffset>50) {
        setShadow("md");
				setLogoColor("#450F76");
      } else {
				setShadow("")
				setLogoColor("#fff");
			}
  };

	const color = useColorModeValue("gray.800", "inherit");

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [props.action]);

  return (
    
    <React.Fragment >
      {
        !supportedChainIds.includes(currentNetwork) ?
        <Alert status='error' justifyContent='center'>
          <AlertIcon />
          <AlertTitle mr={2}>Wrong network detected!</AlertTitle>
          <AlertDescription>Please change network to {supportedChainNames().join(', ')}.</AlertDescription>
          {/* <CloseButton position='absolute' right='8px' top='8px'/> */}
        </Alert>
        : <></>
      }
      <chakra.header 
        style={{position: "sticky",
        top: 0}}
        bg={shadow==="md"? bg : ""}
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
        shadow={shadow}
        zIndex={2}
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <Flex>
            <chakra.a
              href="/"
              title="NUSIC"
              display="flex"
              alignItems="center"
            >
              <VisuallyHidden>NUSIC</VisuallyHidden>
            </chakra.a>
            <RouterLink to="/" style={{textDecoration: 'none'}}>
                <HStack>
                <Image src={Logo} h="60px"/>
                <Box fontSize="28px" letterSpacing="4px" fontWeight="220" color={logoColor}>
                  NUSIC
                </Box>
                </HStack>
            </RouterLink>
          </Flex>
					{props.showMenu ? 
          <HStack display="flex" alignItems="center" spacing={1}>
            <HStack
              spacing={1}
              mr={1}
              color="brand.500"
              display={{ base: "none", md: "inline-flex" }}
            >
              <Box>
              </Box>
              {/* <ToggleTheme /> */}
              <LoginButton />
            </HStack>
            
            <Box display={{ base: "inline-flex", md: "none" }}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={color}
                variant="ghost"
                icon={<HamburgerIcon />}
                onClick={mobileNav.onOpen}
              />
              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? "flex" : "none"}
                flexDirection="column"
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="md"
              >
                <CloseButton
                  aria-label="Close menu"
                  onClick={mobileNav.onClose}
                />

                <Box>
                <Box mt="3">
									<LoginButton />
								</Box>
                </Box>
                {/* <ToggleTheme /> */}
              </VStack>
            </Box>
          </HStack> 
					: <></>}
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
}