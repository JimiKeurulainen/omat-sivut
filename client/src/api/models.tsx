import { axiosInstance } from "../axiosInstance";

export async function getModel(id: string, setProgress: React.Dispatch<React.SetStateAction<number>>, cancelTokenSource: any) {
  const modelURL = process.env.REACT_APP_MODELS ? process.env.REACT_APP_MODELS : 'no env route';

  try {
    const modelResponse = await axiosInstance.get(modelURL + id, {responseType: 'arraybuffer', onDownloadProgress: (progEvent) => {
      // Calculate progress percentage
      if (!cancelTokenSource.token.reason) {
        const total = progEvent.total !== undefined ? progEvent.total : 1;
        setProgress(Math.floor((progEvent.loaded / total) * 100));
      }
    // If component gets unmounted, cancel stream request
    }, cancelToken: cancelTokenSource.token
    });
  }
  catch (e) {

  }
}

export async function getModelInfo() {
  const modelInfoURL = process.env.REACT_APP_MODELSINFO ? process.env.REACT_APP_MODELSINFO : 'no env route';

  // Separate request to get model data as a JSON
  // Used to calculate model polygon count
  // const response = await axiosInstance.get(modelInfoURL + language + '/' + props.ID)
    
  // When stream ends, create object url to put into Gltf object's source
  // const url = window.URL.createObjectURL(new Blob([res.data], {type: 'model/gltf-binary'}));
}