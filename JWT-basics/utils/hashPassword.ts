import * as argon2 from 'argon2';


const hashPassword = async (password:string)=>{
    return await argon2.hash(password);
}


const verifyPassword = async (password:string,digest:string)=>{
    return await argon2.verify(digest,password);
}

export {hashPassword,verifyPassword}