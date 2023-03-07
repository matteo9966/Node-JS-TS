import { m_wrapper } from "../util/middleware-wrapper";
import { Task,ITask } from "../db/connect";
import httpErrors from 'http-errors';
const getAllTasks = m_wrapper(async (req, res, next) => {
    const tasks = await Task.insertOne({
        completed:false,
        id:'task1',
        name:'my first todo'
    })
});

const createTask = m_wrapper(async (req,res,next)=>{
    const task = req.body as ITask;
    console.log(task)
    if((typeof task.completed!='boolean') || !task.name){
        throw  httpErrors.BadRequest('missing task completed or task name');
    }

    // await Task.insertOne(task);
    res.status(201);
    res.json({inserted:true})

})

export const taskControllers ={
  createTask
}

export {createTask}
