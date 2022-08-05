import React from 'react'
import Footer from 'components/Footer'
import {Box} from '@chakra-ui/react';

export default function Home() {
	return (
    <>
			<Box
			fontSize={30}
			fontWeight={220}
			align="center"
			color={'white'}
			pt={200}
			pb={200}
			>Welcome to NUSIC!</Box>
			{/* <AddressFooter /> */}
      <Footer />
    </>
  )
}
