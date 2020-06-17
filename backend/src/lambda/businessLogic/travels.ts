import * as uuid from 'uuid';

import { createLogger } from '../../utils/logger';
import { Travel } from '../../models/Travel';
import { CreateTravelRequest } from '../../requests/CreateTravelRequest';
import { TravelsAccess } from '../dataLayer/travelsAccess';
import { UpdateTravelRequest } from '../../requests/UpdateTravelRequest';
import { S3Acceess } from '../../resourceLayer/s3Access';
import { ImagesAccess } from '../dataLayer/imagesAccess';
import { TravelImage } from '../../models/TravelImage';

const logger = createLogger('travels');
const travelsAccess = new TravelsAccess(); 
const imagesAccess = new ImagesAccess();
const s3Access = new S3Acceess();

export async function createTravel(createTravelRequest: CreateTravelRequest,userId: string): Promise<Travel> {
    logger.info("createTravel is called.", {createTravelRequest});
    const travelId = uuid.v4();
    return await travelsAccess.createTravel({
        id: travelId,
        userId: userId,
        plannedDate: createTravelRequest.plannedDate,
        location: createTravelRequest.location,
        description: createTravelRequest.description,
        duration: createTravelRequest.duration,
        createdDate: new Date().toISOString(),
        isCompleted: false
      });
}

export async function updateTravel(updateTravelRequest: UpdateTravelRequest,travelId: string, userId: string): Promise<void>{
    logger.info('updateTodo called.',{
        updateTravelRequest,
        travelId,
        userId
      });
      return await travelsAccess.updateTravel(updateTravelRequest,travelId,userId);
}

export async function getUserTravel(travelId:string,userId:string): Promise<Travel>{
    logger.info("getUserTravel is called.",{travelId,userId});
    return await travelsAccess.getUserTravel(travelId,userId);
}

export async function deleteTravel(userId: string, travelId: string): Promise<void>{
    logger.info("deleteTravel is called.",{travelId,userId});
    return await travelsAccess.deleteTravel(travelId,userId);
}

export async function getTravel(travelId: string): Promise<Travel>{
    logger.info("getTravel is called.",{travelId});
    return await travelsAccess.getTravel(travelId);
}

export async function getUploadImageUrl(travelId:string): Promise<string>{
    logger.info("getUploadImageUrl is called.", {travelId});
    return await s3Access.getUploadImageUrl(travelId);
}

export async function createTravelImage(travelImageRecord: TravelImage): Promise<TravelImage>{
    logger.info("createTravelImage is called.",{travelImageRecord});
    return await imagesAccess.createTravelImage(travelImageRecord);
}

export async function getUserTravels(userId: string): Promise<Travel[]> {
    logger.info("getUserTravels is called.",{userId});
    return await travelsAccess.getUserTravels(userId);
}

export async function getTravelImages(travelId: string): Promise<TravelImage[]> {
    logger.info("getTravelImages is called.", {travelId});
    return await imagesAccess.getTravelImages(travelId);
}