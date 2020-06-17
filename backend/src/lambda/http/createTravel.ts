import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTravelRequest } from '../../requests/CreateTravelRequest';
import { createLogger } from '../../utils/logger';
import { createTravel } from '../businessLogic/travels';
import { Travel } from '../../models/Travel';
import { getUserId } from '../utils';
//import { getUserId } from '../utils';

const logger = createLogger('createTravel');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("event processing started.",{event});
  const newTravel: CreateTravelRequest = JSON.parse(event.body);
  const userId = getUserId(event);
  const travel: Travel = await createTravel(newTravel,userId);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      travel
    })
  };
}
