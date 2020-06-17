import * as AWS  from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import * as uuid from 'uuid';
import { createLogger } from '../utils/logger';


const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  });

const logger = createLogger("s3Access");

const attachmentBucketName = process.env.TRAVEL_IMAGES_S3_BUCKET;
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION);

export class S3Acceess {
 async getUploadImageUrl(travelId:string): Promise<string> {
  logger.info("getUploadImageUrl is caled.",{travelId});
  const imageId =  uuid.v4();
  const imageS3Key = travelId + "%" + imageId;
  const uploadUrl =  s3.getSignedUrl('putObject',{
       Bucket: attachmentBucketName,
       Key: imageS3Key,
       Expires: urlExpiration
     });
   return uploadUrl;
 }
}