import _ from "underscore";
const DEMO_MODE_DELAY = 300
const METHODS_THAT_ALLOW_PARAMS = ['GET']

export type Params = {
    [key: string]: string | Array<string> | FormData | boolean
}

export type ContentTypes = 'application/json' | 'multipart/form-data'

export const contentTypes: {
    applicationJson: ContentTypes
    multipart: ContentTypes
} = {
    applicationJson: 'application/json',
    multipart: 'multipart/form-data',
}

const doRequest = async function (
    method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE',
    baseUrl: string,
    endpoint: string,
    params: Params = {},
    contentType: ContentTypes = contentTypes.applicationJson,
    abortSignal?: AbortSignal,
): Promise<Response | void> {
    console.log("in doRequest")
    const fetchObj: RequestInit = {
        method,
        credentials: 'include',
        // headers: {
        //     authorization: `Bearer ${_token}`,
        //     'X-Key-Inflection': 'camel',
        //     'Source-App-Name': 'va-health-benefits-app',
        //     ...(featureEnabled('SIS') ? { 'Authentication-Method': 'SIS' } : {}),
        // },
        // ...({ signal: abortSignal } || {}),
    }
    console.log("1st fetchObj=")
    console.log(fetchObj)
    console.log(params)

    if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method) > -1) {
        fetchObj.headers = {
            ...fetchObj.headers,
            'Content-Type': contentType,
        }
        fetchObj.body = contentType === contentTypes.multipart ? (params as unknown as FormData) : JSON.stringify(params)
    }
    console.log("2st fetchObj=")
    console.log(fetchObj)

    if (METHODS_THAT_ALLOW_PARAMS.indexOf(method) > -1) {
        if (_.keys(params).length > 0) {
            endpoint +=
                '?' +
                _.map(params, (val, key) => {
                    if (val instanceof Array) {
                        return _.map(val, (v) => {
                            return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
                        }).join('&')
                    } else {
                        return `${encodeURIComponent(key)}=${encodeURIComponent(val as string)}`
                    }
                }).join('&')
        }
    }

    console.log(`${method}ing to ${baseUrl}${endpoint}`)
    console.log(fetchObj)
    const result = await fetch(`${baseUrl}${endpoint}`, fetchObj).catch((error) => {console.log("An Error Occurred"); console.log(error)}).then((result) => {console.log("Completed fetch"); return result;});
    console.log("Got Result!")
    console.log(result!.body)
    return result
}

const call = async function <T> (
    baseUrl: string,
    method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE',
    endpoint: string,
    params: Params = {},
    contentType?: ContentTypes,
    abortSignal?: AbortSignal,
): Promise<T | undefined> {
    let response
    let responseBody
    try {
        console.log("before doRequest")
        response = await doRequest(method, baseUrl, endpoint, params, contentType, abortSignal)
    } catch (networkError) {
        // networkError coming back as `AbortError` means abortController.abort() was called
        // @ts-ignore
        console.log("got a network error")
        console.log(networkError)
        // if (networkError?.name === 'AbortError') {
        //     return
        // }
        throw { networkError: true }
    }
    return await response!.json()
}

export const get = async function <T>(endpoint: string, params: Params = {}, abortSignal?: AbortSignal): Promise<T> {
    console.log('getting from http://localhost:8088')
    return await call<T>('http://10.0.0.242:8088', 'GET', endpoint, params, undefined, abortSignal).then((result) => {

        return result!;
    })
}

