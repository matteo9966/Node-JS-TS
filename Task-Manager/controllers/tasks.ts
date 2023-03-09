import { m_wrapper } from "../util/middleware-wrapper";
import { Task, ITask } from "../db/connect";
import httpErrors from "http-errors";

const getAllTasks = m_wrapper(async (req, res, next) => {
  const tasks = await Task.getAll();
  res.status(201);
  res.json({ tasks });
});

 const createTask = m_wrapper(async (req, res, next) => {
  const task = req.body as ITask;
  console.log(task);
  if (typeof task.completed != "boolean" || !task.name) {
    throw httpErrors.BadRequest("missing task completed or task name");
  }

  await Task.insertOne(task);
  res.status(201);
  res.json({ inserted: true });
});

const getTask = m_wrapper(async (req, res, next) => {
  const params = req.params;
  const id = params?.id;
  if (!id) {
    throw httpErrors.BadRequest("no id provided");
  }
  const task = await Task.getOne(id);
  if (!task) {
    throw httpErrors.BadRequest(`no task with id ${id}`);
  }
  res.status(200);
  res.json({ task });
});

const deleteTask =m_wrapper(async (req,res,next)=>{
  const id = req.params.id;
  const deleted = await Task.deleteOne(id);
  if(!deleted){
    //
    throw httpErrors.NotFound('no task with id '+id);
  }
  res.status(200);
  res.json({deleted:true});
})

const updateTask = m_wrapper(async (req,res,next)=>{
    const task = req?.body as ITask;
    console.log(task)
    if(!task){
        throw httpErrors.BadRequest('body should contain task object');
    }
    if(!task.id){
        throw httpErrors.BadRequest('task should contain task id');
    }
    const result = await Task.update(task);
    if(!result){
        throw httpErrors.BadRequest('task not deleted')
    }
    res.status(200)
    res.json(result)

})

export const taskControllers = {
  createTask,
  getAllTasks,
};

export { createTask,getTask ,getAllTasks,deleteTask,updateTask};
