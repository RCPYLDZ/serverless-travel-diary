import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { getUserTravel, getUploadImageUrl } from '../businessLogic/travels';
import { getUserId } from '../utils';

const logger = createLogger("generateUploadImageUrl");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("event processing started.",{event});
    const userId = getUserId(event);
    const travelId = event.pathParameters.travelId;
    const travel = await getUserTravel(travelId, userId);
    if(!travel){
        return {
            statusCode: 404,
            body: JSON.stringify({
              error: 'Travel does not exist'
            })
          };
    }else{
        const uploadUrl =  await getUploadImageUrl(travelId);
        return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            uploadUrl
        })
        };
    }
}
