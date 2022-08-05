export const formatThousands = require('format-thousands');

export const format = (num, decimal = 0) => {
	return formatThousands(parseFloat(num).toFixed(decimal).toString(), {separator: ','});
}

export const shortAddress = (address) => {
	return address.substr(0, 8) + "..." + address.substr(address.length - 6, 6);
}