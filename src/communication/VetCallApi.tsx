import {CallEntry} from "../CallPreview";
import httpClient from "./httpClient";

type GetCallsResponse = {
    data: CallEntry[];
}


export type HttpError = {
    message: string;
}


export const getCalls = async () => {
    const uri = "/calls";
    console.log(uri);
    return httpClient.get<GetCallsResponse>(uri, {}).then((response) => {
            return response.data
        }
    ).catch((error) => {
        if(error.code === 'ERR_NETWORK'){
            alert('Error:  No Internet Connection');
            return 'No Internet Connection';
        }
        else {
            alert(`HTTP Error Getting Projects: ${error.message}`);
            return {message: error.code} as HttpError;
        }
    })
}
