//only integration test for signup

import request from "supertest";
import chai from "chai";
import { app } from "../../server";
const expect = chai.expect;

describe("/api/auth/signup", function () {
  it("valid inputs should signup the user if valid input is provided", async function () {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "matteo",
        email: Math.random().toString(16).slice(2) + "@test.it",
        password: "Secret1",
      });

    expect(response.status).to.equal(201);
  });

  describe('invalid signup with user existing',async function(){
    let email ="";
    before(async function () {
         email = Math.random().toString(16).slice(2) + "@test.it"
        return request(app)
        .post("/api/auth/signup")
        .send({
          name: "matteo",
          email: email,
          password: "Secret1",
        });    
    })

    it('should give 400 error if user exists',async function(){
     const response =  await request(app)
        .post("/api/auth/signup")
        .send({
          name: "matteo",
          email: email,
          password: "Secret1",
        });    

        expect(response.status).to.equal(400)
        expect(response.body).to.have.property('message')
        expect(response.body.message).to.equal('user exists');
    })


    
  })

});
