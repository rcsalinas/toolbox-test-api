const { expect } = require('chai');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { listSecretFiles, getFileContent } = require('../../src/services/fileServices');

describe('API Tests', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('listSecretFiles', () => {
    it('should return an array of file names', async () => {
      const files = ['file1.txt', 'file2.txt'];
      mock.onGet('https://echo-serv.tbxnet.com/v1/secret/files').reply(200, { files });

      const result = await listSecretFiles();

      expect(result).to.deep.equal(files);
    });

    it('should throw an error if the request fails', async () => {
      const errorMessage = 'Request failed with status code 500';
      mock.onGet('https://echo-serv.tbxnet.com/v1/secret/files').reply(500, errorMessage);

      try {
        await listSecretFiles();
      } catch (error) {
        expect(error.message).to.equal(errorMessage);
      }
    });
  });

  describe('getFileContent', () => {
    it('should return the content of the specified file', async () => {
      const fileName = 'file1.txt';
      const content = 'File content';
      mock.onGet(`https://echo-serv.tbxnet.com/v1/secret/file/${fileName}`).reply(200, content);

      const result = await getFileContent(fileName);

      expect(result).to.equal(content);
    });
  });
});
