import { JsonDB, Config } from 'node-json-db';

//immagina di avere un oggetto 

class DBConnection{
    db:JsonDB;
    constructor(private dbname:string){
        this.db = this.initDB();
    }

    private initDB(){
        const config = new Config(this.dbname,true,false,'/');
        return new JsonDB(config);
    }

    createModel<T extends {id?:string}>(path:string){
        return new Model<T>(this.db,path);
        //questo crea un model con cui posso interagire con il db
    }
}

class Model<T extends {id?:string}>{
    constructor(private db:JsonDB,private path:string){ //the path is what i use to create the piece in the db 
        
    }

    async insertOne(item:T){
        if(!item.id){
            item.id=Math.random().toString(32).slice(2);
        }
        await this.db.push('/'.concat([this.path,item.id].join('/')),item)
    }
    async getOne(){}

    async getAll(){}

    async insertMany(){}

}


export interface ITask { 
    name:string;
    completed:boolean;
    id?:string;
}

export const dbConnection = new DBConnection('task-db');

export const Task = dbConnection.createModel<ITask>('task');