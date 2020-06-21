import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import * as uuid from 'uuid';
import { createLogger } from '../../utils/logger';


const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  });

const logger = createLogger("s3Access");

const imagesBucketName = process.env.TRAVEL_IMAGES_S3_BUCKET;
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRTION);

export class S3Acceess {
 async getUploadImageUrl(travelId:string): Promise<string> {
  logger.info("getUploadImageUrl is caled.",{travelId});
  const imageId =  uuid.v4();
  const imageS3Key = travelId + "%" + imageId;
  const uploadUrl =  s3.getSignedUrl('putObject',{
       Bucket: imagesBucketName,
       Key: imageS3Key,
       Expires: urlExpiration
     });
   return uploadUrl;
 }

 async deleteImage(imageId: string): Promise<void> {
   logger.info("deleteImage is called.",{imageId});
    await s3.deleteObject({
      Bucket: imagesBucketName,
      Key: imageId
    }).promise();
 }
}