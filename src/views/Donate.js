import React from 'react'
import Footer from 'components/Footer'
import AddressFooter from 'components/AddressFooter';
import DonateComponent from 'components/donate/DonateComponent'
import { useParams } from 'react-router-dom';

export default function Donate() {
	let params = useParams();

	return (
    <>
		{params.id === undefined ? <>You don't have an available ID</> :
      <DonateComponent id={params.id} referer={params.ref === undefined ? "0" : params.ref} />}
			<AddressFooter />
      <Footer />
    </>
  )
}
