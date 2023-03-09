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
  });
});
