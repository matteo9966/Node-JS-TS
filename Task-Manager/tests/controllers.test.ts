//qui vanno tutti i test che devo fare usando sinon e mocha
// import { expect } from "chai";
import chai from "chai";
import sinon, { spy } from "sinon";
import { createTask, deleteTask, getAllTasks, getTask, updateTask } from "../controllers/tasks";
import express from "express";
import { Task } from "../db/connect";
import _ from 'lodash';
import httperrors from 'http-errors';
import chaiaspromised from 'chai-as-promised'

const expect = chai.expect
chai.use(chaiaspromised);

let mockTasks = [
  {
    name: "completed",
    completed: false,
    id: "9pi13mg5fc",
  },
  {
    name: "completed",
    completed: false,
    id: "9pi13mg5fc",
  },
  {
    name: "completed",
    completed: false,
    id: "9pi13mg5fc",
  },
];

let mockTask = { name: "learn sinon", completed: false, id: "9pi13mg5fc" };

let mockUpdateTask = {old:{
    name: "completed",
    completed: false,
    id: "9pi13mg5fc",
  },new:{
    name: "new completed",
    completed: false,
    id: "9pi13mg5fc",
  }}

describe("create Task", function () {
  let req = {
      body: { name: "completed", completed: false },
    } as express.Request,
    res = { json: sinon.stub(), status: sinon.stub() } as unknown as Response;

  beforeEach(function () {
    req = { body: { name: "completed", completed: false } } as express.Request;
    res = { json: sinon.stub(), status: sinon.stub() } as unknown as Response;
    sinon.stub(Task, "insertOne").resolves();
  });
  afterEach(function () {
    sinon.restore();
  });

  it("crete task with right inputs", async function () {
    await createTask(req, res as unknown as express.Response, () => {});
    setTimeout(() => {}, 0);
    sinon.assert.calledOnce(<sinon.SinonStub>res.json);
    sinon.assert.calledWith(<sinon.SinonStub>(<unknown>res.status), 201);
    sinon.assert.calledWith(
      <sinon.SinonStub>res.json,
      sinon.match({ inserted: true })
    );
  });

  it("crete task with missing input should throw", function () {
    expect(createTask(req, res as unknown as express.Response, () => {})).to
      .throw;
  });
});

describe("get all Tasks", function () {
  let resStub = {
    json: sinon.stub(),
    status: sinon.stub(),
  } as unknown as express.Response;
  let req = {} as express.Request;

  beforeEach(function () {
    sinon.stub(Task, "getAll").resolves(mockTasks);
  });

  afterEach(function () {
    sinon.restore();
  });

  it("should get all tasks", async function () {
    await getAllTasks(req, resStub, () => {});
    expect((<sinon.SinonStub>(<unknown>resStub.json)).calledOnce).to.be.true;
    sinon.assert.calledWith(<sinon.SinonStub>(<unknown>resStub.status), 201);
    sinon.assert.calledWith(<sinon.SinonStub>(<unknown>resStub.json), {
      tasks: mockTasks,
    });
  });
});

describe("get single task", function () {
  let req = {
    params: {
      id: "9pi13mg5fc",
    } as express.Request["params"],
  } as express.Request;

  let res = {
    json: sinon.stub(),
    status: sinon.stub(),
  } as unknown as express.Response;

  beforeEach(function () {
    res = {
      json: sinon.stub(),
      status: sinon.stub(),
    } as unknown as express.Response;
  });

  afterEach(function () {
    sinon.restore();
  });

  it("should return a task if id exists", async function () {
    sinon.stub(Task, "getOne").resolves(mockTask);
    await getTask(req, res, () => {});
    sinon.assert.calledWith(<sinon.SinonStub>(<unknown>res.status), 200);
    sinon.assert.calledWith(<sinon.SinonStub>(<unknown>res.json), {
      task: mockTask,
    });
  });
  it("should throw error if no task is found", async function () {
    sinon.stub(Task, "getOne").resolves(null);
    await getTask(req, res, () => {});
    expect(await getTask(req, res, () => {})).to.throw;
  });
});



describe("delete task", async function () {
  let jsonStub = sinon.stub();
  let statusStub = sinon.stub();
  let req = {
    params: {
      id: "9pi13mg5fc",
    } as express.Request["params"],
  } as express.Request;
  let res = {
    json: jsonStub as express.Response["json"],
    status: statusStub as express.Response["status"],
  } as express.Response;

  beforeEach(function () {
    jsonStub = sinon.stub();
    statusStub = sinon.stub();
    res = {
        json: jsonStub as express.Response["json"],
        status: statusStub as express.Response["status"],
      } as express.Response;

  });

  afterEach(function () {
    sinon.restore();
  });

  it('should delete task if task exists',async function(){
      sinon.stub(Task,'deleteOne').resolves(true);
      await deleteTask(req,res,_.noop)
      sinon.assert.calledWith(<sinon.SinonStub>res.json,{deleted:true});
      sinon.assert.calledWith(<sinon.SinonStub>res.status,200)
    })
    
    it('should throw error if task does not exist',async function(){
        sinon.stub(Task,'deleteOne').resolves(false);
        expect(await deleteTask(req,res,_.noop)).to.throw
  })

  

});

describe('update task',function(){
    let req ={
       body:{
        name: "new completed",
        completed: false,
        id: "9pi13mg5fc",
      }
    } as express.Request
    let res = {
      json:sinon.stub() as express.Response['json'],
      status:sinon.stub() as express.Response['status']
    } as express.Response
    it('should update task if body has task object',async function(){
        
        sinon.stub(Task,'update').resolves(mockUpdateTask)
        await updateTask(req,res,_.noop);
        sinon.assert.calledWith(<sinon.SinonStub>res.status,200)
        sinon.assert.calledWith(<sinon.SinonStub>res.json,mockUpdateTask)



    })


    it('should not call res.json if has error',async function(){
      const nextStub = sinon.stub()
      const jsonStub = sinon.stub();
      res.json=jsonStub
      await updateTask({} as express.Request,res,nextStub);
      sinon.assert.notCalled(<sinon.SinonStub>jsonStub)
      
    })

})
