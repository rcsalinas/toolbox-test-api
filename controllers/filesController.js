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
	try {
		const response = await axios.get(fileContentURL + fileName, {
			headers: {
				Authorization: authorizationToken,
			},
		});
		return response.data;
	} catch (err) {
		console.error(
			'Error fetching file content:',
			err.message,
			err.response.data,
		);
		throw err;
	}
};

//getFilesData is the controller function that fetches the data of all files
const getFilesData = async (req, res) => {
	let fileNames;
	try {
		fileNames = await listSecretFiles();
		console.log('fileNames:', fileNames);
	} catch (err) {
		return res.status(500).json({ message: 'Internal server error' });
	}

	const files = await Promise.all(
		fileNames.map(async (fileName) => {
			try {
				const content = await getFileContent(fileName);
				return {
					fileName,
					content,
				};
			} catch (err) {
				return {
					fileName,
					content: 'Error fetching file content',
				};
			}
		}),
	);

	console.log('files:', files);

	return res.status(200).json({ message: 'Files data' });
};

const listFiles = async (req, res) => {
	let fileNames;
	try {
		fileNames = await listSecretFiles();
		console.log('fileNames:', fileNames);
	} catch (err) {
		return res.status(500).json({ message: 'Internal server error' });
	}
	return res.status(200).json({ files: fileNames });
};

module.exports = {
	getFilesData,
	listFiles,
};
