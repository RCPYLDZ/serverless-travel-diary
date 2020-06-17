import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
import { Travel } from '../../models/Travel';
import { getUserTravel, getTravelImages } from '../businessLogic/travels';

const logger = createLogger("getTravelImages");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', {event});
    const userId = getUserId(event);
    const travelId = event.pathParameters.travelId;
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
    const items = await getTravelImages(travelId);
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          items
        })
      }
}