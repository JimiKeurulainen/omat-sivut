import { axiosInstance } from "../axiosInstance";
import { ApiResponse } from "../types/types";

export async function getHtml(file: string): Promise<ApiResponse> {
  const htmlUrl = process.env.REACT_APP_FILES ?? 'no env route';
  console.log('HTML', htmlUrl + file);

  try {
    const response = await axiosInstance.get(htmlUrl + file + '.html');

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
