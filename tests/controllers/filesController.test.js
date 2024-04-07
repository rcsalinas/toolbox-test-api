const { expect } = require('chai');
const sinon = require('sinon');
const filesController = require('../../src/controllers/filesController');
const fileServices = require('../../src/services/fileServices');
const helpers = require('../../src/helpers/helpers');

describe('filesController', () => {
	let listSecretFilesStub;
	let getFileContentStub;
	let processContentStub;
	beforeEach(function () {
		listSecretFilesStub = sinon.stub(fileServices, 'listSecretFiles');
		getFileContentStub = sinon.stub(fileServices, 'getFileContent');
		processContentStub = sinon.stub(helpers, 'processContent');
	});
	afterEach(function () {
		listSecretFilesStub.restore();
		getFileContentStub.restore();
		processContentStub.restore();
	});
	it('should return the list of files', async () => {
		const mockFileNames = ['file1', 'file2', 'file3'];
		listSecretFilesStub.returns(Promise.resolve(mockFileNames));

		const req = {};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};

		await filesController.listFiles(req, res);

		expect(res.status.calledWith(200)).to.be.true;
		expect(res.json.calledWith({ files: mockFileNames })).to.be.true;
	});

	it("returns an error if there's an error fetching the list of files", async () => {
		listSecretFilesStub.throws('Error fetching files data');

		const req = {};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};

		await filesController.listFiles(req, res);

		expect(res.status.calledWith(500)).to.be.true;
		expect(res.json.calledWith({ message: 'Internal server error' })).to.be
			.true;
	});
	it('should return the data of all files', async () => {
		const mockFileNames = ['file1', 'file2', 'file3'];
		listSecretFilesStub.returns(Promise.resolve(mockFileNames));
		getFileContentStub.returns(Promise.resolve('file content'));
		processContentStub.returns('file content');
		const req = {
			query: {
				fileName: null,
			},
		};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};

		await filesController.getFilesData(req, res);

		expect(res.status.calledWith(200)).to.be.true;
		expect(
			res.json.calledWith({
				files: [
					{ file: 'file1', lines: 'file content' },
					{ file: 'file2', lines: 'file content' },
					{ file: 'file3', lines: 'file content' },
				],
			}),
		).to.be.true;
	});
	it('should return the data of a single file', async () => {
		const mockFileNames = ['file1', 'file2', 'file3'];
		listSecretFilesStub.returns(Promise.resolve(mockFileNames));
		getFileContentStub.returns(Promise.resolve('file content'));
		processContentStub.returns('file content');
		const req = {
			query: {
				fileName: 'file1',
			},
		};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};

		await filesController.getFilesData(req, res);

		expect(res.status.calledWith(200)).to.be.true;
		expect(
			res.json.calledWith({
				files: [{ file: 'file1', lines: 'file content' }],
			}),
		).to.be.true;
	});
	it('getting individual file, file services fails not found', async () => {
		const mockFileNames = ['file1', 'file2', 'file3'];
		listSecretFilesStub.returns(Promise.resolve(mockFileNames));
		getFileContentStub.throws({
			response: {
				status: 404,
				message: 'File not found',
			},
		});
		const req = {
			query: {
				fileName: 'file1',
			},
		};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};

		await filesController.getFilesData(req, res);

		expect(res.status.calledWith(404)).to.be.true;
		expect(res.json.calledWith({ message: 'File not found' })).to.be.true;
	});
	it('getting individual file, file services fails internal server error', async () => {
		const mockFileNames = ['file1', 'file2', 'file3'];
		listSecretFilesStub.returns(Promise.resolve(mockFileNames));
		getFileContentStub.throws({
			response: {
				status: 500,
				message: 'Internal server error',
			},
		});
		const req = {
			query: {
				fileName: 'file1',
			},
		};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};

		await filesController.getFilesData(req, res);

		expect(res.status.calledWith(500)).to.be.true;
		expect(res.json.calledWith({ message: 'Internal server error' })).to.be
			.true;
	});
	it('getFilesData, listSecretFiles fails', async () => {
		listSecretFilesStub.throws('Error fetching files data');
		const req = {
			query: {
				fileName: null,
			},
		};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};

		await filesController.getFilesData(req, res);

		expect(res.status.calledWith(500)).to.be.true;
		expect(res.json.calledWith({ message: 'Internal server error' })).to.be
			.true;
	});
	it('getFilesData, getFileContent fails', async () => {
		const mockFileNames = ['file1', 'file2', 'file3'];
		listSecretFilesStub.returns(Promise.resolve(mockFileNames));
		getFileContentStub.throws({
			response: {
				data: 'Error fetching file content',
			},
		});
		const req = {
			query: {
				fileName: null,
			},
		};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};

		await filesController.getFilesData(req, res);

		expect(res.status.calledWith(200)).to.be.true;
	});
});
