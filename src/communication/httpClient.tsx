import axios from "axios";

// Make all api calls local. In production this will call the api since both the frontend and api are
// hosted on the same domain. In development, vite is configured to proxy these requests
// to http://localhost:8080 which is the same domain that Spring works on by default. To change this,
// see `vite.config.ts`.
const URL = "http://localhost:8088/";

const httpClient = axios.create({
    baseURL: URL,
    headers: {
        Accept: "application/json",
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

httpClient.interceptors.request.use((request) => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request;
});

httpClient.interceptors.response.use((response) => {
    //console.log('Response:', JSON.stringify(response, null, 2))
    return response;
});

export default httpClient;
