const { expect } = require('chai');
const { processContent } = require('../../src/helpers/helpers');

describe('processContent', () => {
	it('should return an empty array if the content has only one line', () => {
		const content = 'file,text,number,hex';
		const result = processContent(content);
		expect(result).to.deep.equal([]);
	});
	it('should return an array of objects with text, number, and hex properties', () => {
		const content = `file,text,number,hex
    file1,text1,1,0x1
    file2,text2,2,0x2
    file3,text3,3,0x3`;
		const result = processContent(content);
		expect(result).to.deep.equal([
			{ text: 'text1', number: '1', hex: '0x1' },
			{ text: 'text2', number: '2', hex: '0x2' },
			{ text: 'text3', number: '3', hex: '0x3' },
		]);
	});
	it('should return an array of objects with text, number, and hex properties even if there are invalid lines', () => {
		const content = `file,text,number,hex
    file1,text1,1,0x1
    file2,text2,2,0x2
    invalid line
    file3,text3,3,0x3`;
		const result = processContent(content);
		expect(result).to.deep.equal([
			{ text: 'text1', number: '1', hex: '0x1' },
			{ text: 'text2', number: '2', hex: '0x2' },
			{ text: 'text3', number: '3', hex: '0x3' },
		]);
	});
	it('should return an empty array if there are no valid lines', () => {
		const content = `file,text,number,hex
    invalid line1
    invalid line2
    invalid line3`;
		const result = processContent(content);
		expect(result).to.deep.equal([]);
	});
	it('should skip line with invalid number', () => {
		const content = `file,text,number,hex
    file1,text1,1,0x1
    file2,text2,1o,0x2
    file3,text3,3,0x3`;
		const result = processContent(content);
		expect(result).to.deep.equal([
			{ text: 'text1', number: '1', hex: '0x1' },
			{ text: 'text3', number: '3', hex: '0x3' },
		]);
	});
});
