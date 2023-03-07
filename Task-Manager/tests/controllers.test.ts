//qui vanno tutti i test che devo fare usando sinon e mocha
import {expect} from 'chai'
import sinon,{spy} from 'sinon'
import { createTask } from '../controllers/tasks'
import express from 'express'
import { Task } from '../db/connect'






describe('Task test', function(){
    let sandbox;
    beforeEach(function(){
        sandbox = sinon.createSandbox()
    })
    afterEach(function(){
        sinon.restore()

    })
    
    it('crete task with right inputs',function(){

        sinon.stub(Task,'insertOne').resolves();
        const req = {body:{name:'completed',completed:false}} as express.Request;
        const stub = sinon.stub().returns({});
        const res = {json:sinon.stub(),status:sinon.stub()} as unknown as Response;
        createTask(req,res as unknown as express.Response,()=>{});
        sinon.assert.calledOnce(<sinon.SinonStub>res.json)
        sinon.assert.calledWith(<sinon.SinonStub><unknown>res.status,201)
      

    })
    it('crete task with missing input should throw',function(){

        sinon.stub(Task,'insertOne').resolves();
        const req = {body:{name:'completed'}} as express.Request;
        const stub = sinon.stub().returns({});
        const res = {json:sinon.stub(),status:sinon.stub()} as unknown as Response;
        expect(createTask(req,res as unknown as express.Response,()=>{})).to.throw 
    })
})