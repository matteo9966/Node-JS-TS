import sinon from "sinon";
import chai from "chai";
import { addProduct } from "../controllers/product.controller";
import { Product } from "../db/connect";
import express from "express";
import _ from "lodash";
const mockproduct = {
  company: "ikea",
  price: 30,
  name: "zod item",
};

describe("product controller", function () {
  describe("add product controller", function () {
    it("should return a json with a true value if object is inserted", async function () {
      const req = { body: mockproduct } as express.Request;
      const res = {
        json: sinon.stub() as express.Response["json"],
      } as express.Response;
      sinon.stub(Product, "insertOne").resolves();
      await addProduct(req, res, _.noop);
      sinon.assert.calledWith(<sinon.SinonStub>res.json, { inserted: true });
    });

    it("should return have a status of 400 when passing a bad product", async function () {
      const req = {} as express.Request;
      const res = {
        status: sinon.stub() as express.Response["status"],
        json: sinon.stub() as express.Response["json"],
      } as express.Response;
      await addProduct(req, res, _.noop);
      sinon.assert.calledWith(<sinon.SinonStub>res.status, 400);
      sinon.assert.calledWith(
        <sinon.SinonStub>res.json,
        sinon.match.hasOwn("inserted", false)
      );
    });
  });
});
