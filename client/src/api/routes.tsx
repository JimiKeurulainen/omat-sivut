import { axiosInstance } from "../axiosInstance";
import { ApiResponse } from "../types/types";

export async function getRoutes(): Promise<ApiResponse> {

  const routesURL = process.env.REACT_APP_ROUTES ? process.env.REACT_APP_ROUTES : 'no env route';
  try {
    const response = await axiosInstance.get(routesURL);

    return {
      error: false,
      message: '',
      data: response.data
    }
  }
  catch (e) {
    return {
      error: true,
      message: e as string,
      data: null
    }
  }
}
