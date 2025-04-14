import { get, post, put, del } from 'aws-amplify/api';

// Base API configuration
const API_NAME = 'PharmacyAPI';

// Generic API functions
export const fetchData = async <T>(path: string): Promise<T> => {
  const response = await get({ apiName: API_NAME, path });
  return response.body as T;
};

export const createData = async <T>(path: string, data: any): Promise<T> => {
  const response = await post({ 
    apiName: API_NAME, 
    path,
    options: {
      body: data
    }
  });
  return response.body as T;
};

export const updateData = async <T>(path: string, data: any): Promise<T> => {
  const response = await put({ 
    apiName: API_NAME, 
    path,
    options: {
      body: data
    }
  });
  return response.body as T;
};

export const deleteData = async (path: string): Promise<void> => {
  await del({ apiName: API_NAME, path });
};