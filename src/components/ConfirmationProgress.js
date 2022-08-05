import React from "react";
import { Box, Progress } from "@chakra-ui/react";
import intl from "../utils/intl";

const ConfirmationProgress = (props) => {
	const { hidden, message, value, step } = props;

  return (
		<Box>
		{hidden ? <Box></Box> :
    <Box
      w="full"
      pb={5}
      mx="auto"
    >
      {intl.get("step") + step + ": " + message}
      <Progress 
				mt={3}
				size="xs"
				colorScheme="gray"
				value={value} 
			/>
    </Box>
		}
		</Box>
  );
};

export default ConfirmationProgress;
