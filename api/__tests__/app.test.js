const seed = require("../../db/seed");
const { client } = require("../../db/connection");
const app = require('../app');
const request=require('supertest')

jest.setTimeout(15000);

beforeEach(() => {
  return seed();
});

afterAll(() => client.close());

describe("Express App", () => {

  describe("General Error Handling",()=>{
    it("404: Specified path not found (e.g. /trips)", () => {
      return request(app).get('/TRIPS').expect(404).then(({body:{msg}}) =>{
        expect(msg).toBe('Invalid Path');
      })
    });
  })
  
});
