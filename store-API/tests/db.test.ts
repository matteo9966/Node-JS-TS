import { Model } from "../db/connect";
import { JsonDB, Config } from "node-json-db";
import sinon from "sinon";
import chai from 'chai';
import _ from "lodash";
const expect = chai.expect;

type mockType = {id?:string,price:number};
const mockData:Record<string,mockType> = {
  id1: { id: "id1", price: 30 },
  id2: { id: "id2", price: 40 },
  id3: { id: "id3", price: 50 },
};

describe("testing db Model class", function () {

  describe("find one ", function () {
    let stubDB = sinon.createStubInstance(JsonDB); //doesnt call the constructor

    afterEach(function () {
      sinon.restore();
      sinon.reset();
    });

    beforeEach(function () {
      stubDB = sinon.createStubInstance(JsonDB);
      stubDB.getData = sinon.stub();
    });

    it("should return null if no value respects the test", async function () {
      const model = new Model(stubDB, "/path");
      stubDB.getData.resolves(mockData);
      const findcb = (input:mockType)=> input.price<30;
      const result = await model.find(findcb)
      expect(result).to.be.null
    });

    it("should find an instance of an object if its inside the db", async function () {
      const model = new Model(stubDB, "/path");
      stubDB.getData.resolves(mockData);
      const findcb = (input:mockType)=> input.price<50;
      const result = await model.find(findcb)
      expect(result).to.have.property('price')
    });
  });
});
describe("testing db Model class", function () {

  describe("find all", function () {
    let stubDB = sinon.createStubInstance(JsonDB); //doesnt call the constructor

    afterEach(function () {
      sinon.restore();
      sinon.reset();
    });

    beforeEach(function () {
      stubDB = sinon.createStubInstance(JsonDB);
      stubDB.getData = sinon.stub();
    });

    it("should find values when filtering", async function () {
      const model = new Model(stubDB, "/path");
      stubDB.getData.resolves(mockData);
      const findcb = (input:mockType)=> input.price<50;
      const expected = _.values(mockData).filter(findcb)
      const result = await model.findAll(findcb)
      expect(result).to.deep.equal(expected)
    });
  });
});
