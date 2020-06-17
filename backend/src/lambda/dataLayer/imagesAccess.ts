import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../../utils/logger';
import { TravelImage } from '../../models/TravelImage';

const logger =  createLogger("imagesAccess");

const XAWS = AWSXRay.captureAWS(AWS);

export class ImagesAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly travelImagesTable = process.env.TRAVEL_IMAGES_TABLE) {
        }
    async createTravelImage(travelImageRecord: TravelImage): Promise<TravelImage> {
        logger.info("createTravelImage called.",{
            travelImageRecord,
            tableName:this.travelImagesTable
        });
        await this.docClient.put({
            TableName: this.travelImagesTable,
            Item: travelImageRecord
        }).promise();
        return travelImageRecord;
    }

    async getTravelImages(travelId: string): Promise<TravelImage[]> {
        logger.info("getTravelImages is called.", {travelId});
        const result = await this.docClient.query({
            TableName: this.travelImagesTable,
            KeyConditionExpression: 'travelId = :travelId',
            ExpressionAttributeValues: {
              ':travelId': travelId
            },
            ScanIndexForward: false
          }).promise();
        const items = result.Items;
        return items as TravelImage[];
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance');
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      });
    }
  
    return new XAWS.DynamoDB.DocumentClient();
  }