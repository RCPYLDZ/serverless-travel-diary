import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../../utils/logger';
import { Travel } from '../../models/Travel';
import { UpdateTravelRequest } from '../../requests/UpdateTravelRequest';

const logger =  createLogger("travelsAccess");

const XAWS = AWSXRay.captureAWS(AWS);
const travelIdIndexName = process.env.TRAVEL_ID_INDEX;
const userIdIndexName = process.env.USER_ID_INDEX;

export class TravelsAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly travelTable = process.env.TRAVELS_TABLE) {

        }

    async createTravel(travel: Travel): Promise<Travel> {
        logger.info("createTravel called.",{
            travel,
            tableName:this.travelTable
        });
        await this.docClient.put({
            TableName: this.travelTable,
            Item: travel
        }).promise();
        return travel;
    }

    async updateTravel(updateTravelRequest: UpdateTravelRequest,travelId: string,userId: string) :Promise<void>{
        logger.info("updateTravel is called.",{updateTravelRequest,travelId,userId});
        
        const result = await this.docClient.update({
        TableName:this.travelTable,
        Key:{
            "id": travelId,
            "userId": userId
        },
        UpdateExpression: "set #plannedDate = :plannedDate, #location = :location, #description = :description,#duration = :duration,#isCompleted= :isCompleted",
        ExpressionAttributeNames: {
            '#plannedDate': 'plannedDate',
            '#location': 'location',
            '#description': 'description',
            '#duration':'duration',
            '#isCompleted':'isCompleted'
        },
        ExpressionAttributeValues: {
            ":plannedDate": updateTravelRequest.plannedDate,
            ":location": updateTravelRequest.location,
            ":description": updateTravelRequest.description,
            ":duration": updateTravelRequest.duration,
            ":isCompleted": updateTravelRequest.isCompleted
        },
        }).promise();

        logger.info("updateTravel is completed.",{result});
    }

    async getUserTravel(travelId: string,userId: string):Promise<Travel>{
        logger.info("getUserTravel is called.",{travelId,userId});
        const result = await this.docClient.query({
            TableName: this.travelTable,
            KeyConditionExpression: 'id = :travelId and userId = :userId',
            ExpressionAttributeValues: {
              ':travelId': travelId,
              ':userId'  : userId
            },
            ScanIndexForward: false
          }).promise();
          if(result.Items && result.Items.length > 0){
            return Promise.resolve(result.Items[0] as Travel);
          }
          else{
            return Promise.resolve(undefined);
          }
    }

    async deleteTravel(travelId: string, userId: string): Promise<void> {
      logger.info("delete travel is called.", {travelId,userId});
      await this.docClient.delete({
        TableName: this.travelTable,
        Key: {
          "id": travelId,
          "userId": userId
        }
      }).promise();
    }

    async getTravel(travelId: string):Promise<Travel>{
      logger.info("getTravel is called.",{travelId});
      const result = await this.docClient.query({
        TableName: this.travelTable,
        IndexName: travelIdIndexName,
        KeyConditionExpression: 'id = :travelId',
        ExpressionAttributeValues: {
            ':id': travelId
        }
      }).promise();
      if(result.Items && result.Items.length > 0){
        return Promise.resolve(result.Items[0] as Travel);
      }
      else{
        return Promise.resolve(undefined);
      }
    }

    async getUserTravels(userId: string):Promise<Travel[]>{
      logger.info("getUserTravel is called.",{userId});
      const result = await this.docClient.query({
        TableName: this.travelTable,
        IndexName: userIdIndexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
      }).promise();
      const items = result.Items;
      return items as Travel[];
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