import sinon from "sinon";
import chai from "chai";
import { addProduct, getAllProducts } from "../controllers/product.controller";
import { Product } from "../db/connect";
import express from "express";
import _ from "lodash";
import { ProductType } from "../models/product.model";
import { getAllQueryType } from "../utils/getAllProducts-queryParser";
const mockproduct = {
  company: "ikea",
  price: 30,
  name: "zod item",
};

const mockList: ProductType[] = [
  {
    name: "testitem3",
    price: 30,
    featured: false,
    rating: 2.35,
    createdAt: new Date("2023-03-09T16:07:30.529Z"),
    company: "caressa",
    id: "v9jklid0kr",
  },
  {
    name: "testitem1",
    price: 130,
    featured: false,
    rating: 4.5,
    createdAt: new Date("2023-03-09T16:07:30.529Z"),
    company: "ikea",
    id: "v9jklid0kr",
  },
  {
    name: "testitem2",
    price: 302,
    featured: true,
    rating: 4.15,
    createdAt: new Date("2023-03-09T16:07:30.529Z"),
    company: "ikea",
    id: "v9jklid0kr",
  },
];

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

  describe("get all products", function () {

    beforeEach(
      function(){

      }
    )
    afterEach(
      function(){
        sinon.restore();
        sinon.reset();
      }
    )


    it("should get the full list of products if i dont have any querystring", async function () {
      const req = { query: {} } as express.Request;
      const res = {
        json: sinon.stub() as express.Response["json"],
        status: sinon.stub() as express.Response["status"],
      } as express.Response;
      sinon.stub(Product, "getAll").resolves(mockList);
      await getAllProducts(req, res, _.noop);
      sinon.assert.calledWith(<sinon.SinonStub>res.json, mockList);
    });


    it("should get the filtered by company name", async function () {
      const filterQuery = { company: "caressa" };
      const req = {
        query: filterQuery as express.Request["query"],
      } as express.Request;
      const res = {
        json: sinon.stub() as express.Response["json"],
        status: sinon.stub() as express.Response["status"],
      } as express.Response;

      sinon.stub(Product, "getAll").resolves(mockList);

      const expectedResult = _.filter(mockList, filterQuery);

      await getAllProducts(req, res, _.noop);
      sinon.assert.calledWith(<sinon.SinonStub>res.json, expectedResult);

    });


    it('should order all items by rating in aascending order 0->5',async function(){
      const query:getAllQueryType = {orderBy:'rating'}
      const req = {
        query:query as express.Request["query"],
      } as express.Request;
      const res = {
        json: sinon.stub() as express.Response["json"],
        status: sinon.stub() as express.Response["status"],
      } as express.Response;
      sinon.stub(Product, "getAll").resolves(mockList);
      await getAllProducts(req,res,_.noop);
      
      const expectedResult = _.orderBy(mockList,query.orderBy)

      sinon.assert.calledWith(<sinon.SinonStub>res.json,expectedResult);

    })

  });
});
