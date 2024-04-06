const axios = require('axios');

const listFilesURL = 'https://echo-serv.tbxnet.com/v1/secret/files';
const authorizationToken = 'Bearer aSuperSecretKey'; //Obviously this would be in a .env file but for the sake of the example Im are hardcoding it
const fileContentURL = 'https://echo-serv.tbxnet.com/v1/secret/file/';

//processContent is a function that processes the content of a file
const processContent = (content) => {
	const lines = content.trim().split('\n');

	const linesData = [];

	if (lines.length === 1) {
		return [];
	}
	const lineRegex = /^([^,]+),([^,]+),(\d+),([^,]+)$/;
	for (let i = 1; i < lines.length; i++) {
		const match = lines[i].trim().match(lineRegex);
		if (match) {
			const [, text, number, hex] = match.slice(1);
			//convert number to integer and check if it is a number
			const numberInt = parseInt(number);
			if (isNaN(numberInt)) {
				continue;
			}
			linesData.push({ text, number, hex });
		}
	}

	return linesData;
};

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
		throw err;
	}
};

//getFilesData is the controller function that fetches the data of all files
const getFilesData = async (req, res) => {
	const fileName = req.query.fileName;

	if (fileName) {
		try {
			const content = await getFileContent(fileName);
			const lines = processContent(content);
			return res.status(200).json({ file: fileName, lines: lines });
		} catch (err) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	}
	let fileNames;
	try {
		fileNames = await listSecretFiles();
		console.log('fileNames:', fileNames);
	} catch (err) {
		return res.status(500).json({ message: 'Internal server error' });
	}

	const files = [];

	for (const file of fileNames) {
		try {
			const content = await getFileContent(file);
			const lines = processContent(content);
			files.push({ file, lines });
		} catch (err) {
			console.error(
				'Error fetching file content for:',
				file,
				err.response.data,
			);
		}
	}

	return res.status(200).json({ files });
};

//listFiles is the controller function that fetches the list of files
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
