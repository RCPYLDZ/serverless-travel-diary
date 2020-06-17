import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { Travel } from '../../models/Travel';
import { UpdateTravelRequest } from '../../requests/UpdateTravelRequest';
import { updateTravel, getUserTravel } from '../businessLogic/travels';
import { getUserId } from '../utils';
//import { getUserId } from '../utils';

const logger = createLogger('updateTravel');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
        logger.info("event processing started.",{event});
        const travelId = event.pathParameters.travelId;
        const updateTravelRequest: UpdateTravelRequest = JSON.parse(event.body);
        const userId = getUserId(event);
        const travel: Travel = await getUserTravel(travelId,userId);
        if(!travel){
            logger.error("Travel not found",{travelId});
            return {
                statusCode: 404,
                headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
                },
                body: "Travel Item not found"
            };
        }
        await updateTravel(updateTravelRequest,travelId,userId);
        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: ""
        };
    }catch(e){
        logger.error("An error occured. ",{
            e
        });
        return {
        statusCode: 500,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: "An error occured please try again later."
        };
    }
  }