export interface APIResponse<T> {
    error:boolean,
    message?:string,
    statusCode?:number,
    data?:T
}