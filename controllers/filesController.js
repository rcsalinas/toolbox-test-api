const getFilesData = async (req, res) => {
	return res.status(200).json({ message: 'Files data' });
};

module.exports = {
	getFilesData,
};
