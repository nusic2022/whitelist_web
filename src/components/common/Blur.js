import {
    useBreakpointValue,
    Icon
  } from '@chakra-ui/react'

export const Blur = (props) => {
    return (
      <Icon
        width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
        zIndex="-1"
        height="800px"
        viewBox="0 100 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <circle cx="1000" cy="1000" r="4000" fill="#7C04A8" />
        {/* <circle cx="100" cy="100" r="100" fill="#9615C5" /> */}
        {/* <circle cx="244" cy="106" r="139" fill="#C66CE7" /> */}
        {/* <circle cy="291" r="139" fill="#ED64A6" /> */}
        {/* <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" /> */}
        {/* <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" /> */}
        {/* <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" /> */}
      </Icon>
    //   <Icon
		// 	width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
		// 	zIndex="-1"
		// 	height="560px"
		// 	viewBox="0 0 528 560"
		// 	fill="none"
		// 	xmlns="http://www.w3.org/2000/svg"
		// 	{...props}
		// >
		// 	<circle cx="71" cy="61" r="111" fill="#F56565" />
		// 	<circle cx="244" cy="106" r="139" fill="#ED64A6" />
		// 	<circle cy="291" r="139" fill="#ED64A6" />
		// 	<circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
		// 	<circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
		// 	<circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
		// 	<circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
		// </Icon>
	);
  };