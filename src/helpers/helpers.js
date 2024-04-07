//processContent is a function that processes the content of a file
const processContent = (content) => {
	const lines = content.trim().split('\n');

	const linesData = [];

	if (lines.length === 1) {
		return [];
	}
	const lineRegex = /^([^,]+),([^,]+),(0|[1-9]\d*(?:\.\d+)?),([^,]+)$/;
	for (let i = 1; i < lines.length; i++) {
		const match = lines[i].trim().match(lineRegex);
		if (match) {
			const [, text, number, hex] = match.slice(1);
			linesData.push({ text, number, hex });
		}
	}

	return linesData;
};

module.exports = {
	processContent,
};
