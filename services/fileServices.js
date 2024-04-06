const axios = require('axios');

const listFilesURL = 'https://echo-serv.tbxnet.com/v1/secret/files';
const authorizationToken = 'Bearer aSuperSecretKey'; //Obviously this would be in a .env file but for the sake of the example Im are hardcoding it
const fileContentURL = 'https://echo-serv.tbxnet.com/v1/secret/file/';

//listSecretFiles is a function that fetches the list of file names
const listSecretFiles = async () => {
	try {
		const response = await axios.get(listFilesURL, {
			headers: {
				Authorization: authorizationToken,
			},
		});
		return response.data.files;
	} catch (err) {
		console.error('Error fetching files data:', err);
		throw err;
	}
};

//getFileContent is a function that fetches the content of a file by its name
const getFileContent = async (fileName) => {
	const response = await axios.get(fileContentURL + fileName, {
		headers: {
			Authorization: authorizationToken,
		},
	});
	return response.data;
};

module.exports = {
	listSecretFiles,
	getFileContent,
};
