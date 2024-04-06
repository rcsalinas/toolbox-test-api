const { processContent } = require('../helpers/helpers');
const { listSecretFiles, getFileContent } = require('../services/fileServices');

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