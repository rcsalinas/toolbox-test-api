const helpers = require('../helpers/helpers');
const fileServices = require('../services/fileServices');

//getFilesData is the controller function that fetches the data of all files
const getFilesData = async (req, res) => {
	const fileName = req.query.fileName;

	if (fileName) {
		try {
			const content = await fileServices.getFileContent(fileName);
			const lines = helpers.processContent(content);
			return res
				.status(200)
				.json({ files: [{ file: fileName, lines: lines }] });
		} catch (err) {
			if (err.response.status === 404) {
				return res.status(404).json({ message: 'File not found' });
			} else {
				return res.status(500).json({ message: 'Internal server error' });
			}
		}
	}
	let fileNames;
	try {
		fileNames = await fileServices.listSecretFiles();
		console.log('fileNames:', fileNames);
	} catch (err) {
		return res.status(500).json({ message: 'Internal server error' });
	}

	const files = [];

	for (const file of fileNames) {
		try {
			const content = await fileServices.getFileContent(file);
			const lines = helpers.processContent(content);
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
		fileNames = await fileServices.listSecretFiles();
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
