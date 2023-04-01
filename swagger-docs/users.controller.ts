import e from "express";

type User = {
    id:string;
    name:string;
    email:string;
    age:number;
}
type ResponseBody = {
    error:boolean;
    message?:string;
    data?:any
}
const users:User[] = [
    {id:'use1',age:13,email:'a@a.it',name:'adamo'},
    {id:'use2',age:33,email:'b@a.it',name:'ben'},
    {id:'use3',age:11,email:'c@a.it',name:'sam'},
    {id:'use4',age:54,email:'d@a.it',name:'lu'},
    {id:'use5',age:23,email:'e@a.it',name:'radam'},
    {id:'use6',age:11,email:'f@a.it',name:'roost'},
]

const getUserController:e.RequestHandler=function(req,res,next){
    const responsebody:ResponseBody ={error:false};
    //params
    const {id}= req.params;
    if(!id){
        responsebody.error=true;
        responsebody.message="missing id"
        res.json(responsebody)
        res.status(400)
        return
    }
    const user = users.find(u=>u.id===id);

    if(!user){
        responsebody.error=false;
        responsebody.data={};
        res.status(200);
        res.json(responsebody)
        return
    }

    responsebody.data=user;
    res.status(200).json(responsebody);
}

const addUsercontroller:e.RequestHandler=function(req,res,next){
    const {name,age,email}= req.body;
    const responsebody:ResponseBody ={error:false};
    if(!(name && age && email)){
        responsebody.error=true;
        responsebody.message="missing properties, required are name age email"
        res.json(responsebody)
        res.status(400)
        return
    }
    const newUSer:User={
        name,
        age,
        email,
        id:Math.random().toString(16).slice(3,7)
    }
    users.push(newUSer);
    responsebody.data=newUSer
    res.status(200).json(responsebody)

}

export {addUsercontroller,getUserController}