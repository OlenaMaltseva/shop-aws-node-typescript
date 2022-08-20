import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
// import importService from '../../services/import'; //TODO move to import service

const s3 = new S3();
const csvParser = require('csv-parser'); //TODO check import, wasn't working

const importFileParser = async (event: S3Event) => {

  try {
    const results = await Promise.all(

      event.Records.map(async (record) => {

        const importFileName = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
        const { name: bucketName } = record.s3.bucket;

  //read stream
        const csvParsedResult = await getStreamReadResult(bucketName, importFileName);

  //upload as json to parsed
        const parsedFilePath = await getParsedFile(csvParsedResult, importFileName, bucketName);

  //copy to parsed
        await copyParsedFile(bucketName, importFileName, parsedFilePath);

  //delete from uploaded
        await deleteParsedFile(bucketName, importFileName);

        return csvParsedResult;

    }));

    console.log('Parse result: ', results);

    return formatJSONResponse({ results });
  } catch (error) {
      return formatJSONResponse(error);//TODO make consistent error & response types for services
  }

};

export const main = middyfy(importFileParser);


async function getStreamReadResult(bucketName: string, importFileName: string) {
  const csvFileReq = s3.getObject({
    Bucket: bucketName,
    Key: importFileName,
  });

  const csvParsedResult = await new Promise<string>((resolve, reject) => {
    const resultChunks = [];

    csvFileReq.createReadStream()
      .pipe(csvParser())
      .on('csvData', (csvData) => resultChunks.push(csvData))
      .on('end', () => resolve(JSON.stringify(resultChunks)))
      .on('error', () => reject(new Error('Csv parse error occured')));
  });
  return csvParsedResult;
}

//TODO move to import service
async function deleteParsedFile(bucketName: string, importFileName: string) {
  await s3.deleteObject({
    Bucket: bucketName,
    Key: importFileName,
  }).promise();

  console.log('csv file deleted from "uploaded" folder');
}

async function copyParsedFile(bucketName: string, importFileName: string, parsedFilePath: string) {
  await s3.copyObject({
    Bucket: bucketName,
    CopySource: `${bucketName}/${importFileName}`,
    Key: parsedFilePath,
  }).promise();

  console.log('Csv file copied to "parsed" folder');
}

async function getParsedFile(csvParsedResult: string, importFileName: string, bucketName: string) {
  const parseResultsJson = Buffer.from(csvParsedResult);
  const parsedFilePath = `parsed/${importFileName.split('/').slice(1).join('/')}`;

  await s3.upload({
    Bucket: bucketName,
    Key: parsedFilePath.replace('csv', 'json'),
    ContentType: 'application/json',
    Body: parseResultsJson,
  }).promise();

  console.log('Parsed JSON file uploaded to parsed/');
  return parsedFilePath;
}

