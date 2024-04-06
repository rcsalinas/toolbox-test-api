const axios = require('axios');

const listFilesURL = 'https://echo-serv.tbxnet.com/v1/secret/files';
const authorizationToken = 'Bearer aSuperSecretKey'; //Obviously this would be in a .env file but for the sake of the example Im are hardcoding it

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

const getFilesData = async (req, res) => {
	try {
		const filesData = await listSecretFiles();
		console.log(filesData);
	} catch (err) {
		return res.status(500).json({ message: 'Internal server error' });
	}

	return res.status(200).json({ message: 'Files data' });
};

module.exports = {
	getFilesData,
};
