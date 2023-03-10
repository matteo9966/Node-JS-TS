export class CustomZodError extends Error {
    
    constructor(public message:string){
        super(message);
    }
}