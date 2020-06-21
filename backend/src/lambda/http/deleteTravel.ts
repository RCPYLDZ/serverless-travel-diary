import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
import { getUserTravel, deleteTravel } from '../businessLogic/travels';

const logger = createLogger("deleteTravel");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("event processing started.",{event});
    try{
        const travelId = event.pathParameters.travelId;
        const userId = getUserId(event);
        const travel = await getUserTravel(travelId,userId);
        if(!travel){
          logger.error("Travel not found",{travelId,userId});
            return {
              statusCode: 404,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
              body: "Travel not found"
            };
        }
        await deleteTravel(userId,travelId);
        //await deleteTravelImages(travelId);
      }catch(e){
        logger.error("An error occured.", {e})
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: "An error occured please try again later."
        };
      }
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: ""
      };
}