import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
import { getUserTravels } from '../businessLogic/travels';
const logger = createLogger("getUserTravels");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', {event});
    const userId = getUserId(event);
    const items = await getUserTravels(userId);
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