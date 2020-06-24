import { apiEndpoint } from '../config'
import { Travel } from '../types/Travel';
import Axios from 'axios';
import { TravelImage } from '../types/TravelImage';

export async function getTravels(idToken: string): Promise<Travel[]> {
    console.log('Fetching travels')
  
    const response = await Axios.get(`${apiEndpoint}/travels`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    });
    console.log('Travels:', response.data);
    return response.data.items;
}

export async function getTravelImages(idToken: string,travelId: string): Promise<TravelImage []> {
  console.log('Fetching travels images')

  const response = await Axios.get(`${apiEndpoint}/images/${travelId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  });
  console.log('Travels Images:', response.data);
  return response.data.items;
}

export async function deleteTravel(idToken: string, travelId: string): Promise<void> {
  console.log("Deleting travel. TravelId : " + travelId);
  const response = await Axios.delete(`${apiEndpoint}/travels/${travelId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
  console.log("deleteTravel response : " + JSON.stringify(response.data));
}

export async function updateTravel(idToken: string, travel: Travel): Promise<void>{
  console.log("UpdateTravel invoked. Travel : " + JSON.stringify(travel));

  const updateTravel = {
    plannedDate: travel.plannedDate,
    location: travel.location,
    description: travel.description,
    duration: travel.duration,
    isCompleted: travel.isCompleted
  };

  await Axios.patch(`${apiEndpoint}/travels/${travel.id}`, JSON.stringify(updateTravel), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
}

export async function createTravel(idToken: string, travel: Travel): Promise<void>{
  console.log("createTravel invoked. Travel : " + JSON.stringify(travel));
  const newTravel = {
    plannedDate: travel.plannedDate,
    location: travel.location,
    description: travel.description,
    duration: travel.duration
  }
  await Axios.post(`${apiEndpoint}/travels`,  JSON.stringify(newTravel), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
}

export async function getUploadUrl(
  idToken: string,
  travelId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/travels/${travelId}/image`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl;
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
