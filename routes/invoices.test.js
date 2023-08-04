//connect to right DB
process.env.NODE_ENV = 'test';

// npm packages
const request = require('supertest');

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

// before each test, clean out data
beforeEach(createData);

afterAll(async () => {
  await db.end()
})

describe ('GET /', async () => {
    test('It should respond with an array of invoices', async () => {
        const response = await request(app).get('/invoices');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            "invoices": [
                {id: 1, comp_code: "apple"},
                {id: 2, comp_code: "apple"},
                {id: 3, comp_code: "ibm"},
            ]
        });
      })
    });


    describe("GET /1", function () {

        test("It return invoice info", async function () {
          const response = await request(app).get("/invoices/1");
          expect(response.body).toEqual(
              {
                "invoice": {
                  id: 1,
                  company: {
                    code: "apple",
                    name: "Apple Computer",
                    description: "Maker of OSX."
                  },
                  amt: 100,
                  paid: false,
                  add_date: "2023-07-27T07:00:00.000Z",
                  paid_date: null
                }
            }
          )
          }
      );
   
    test("It should return 404 for no-such-invoice", async function () {
        const response = await request(app).get("/invoices/999");
        expect(response.status).toEqual(404);
      })
    });

    describe("POST /", function () {
        test("It should add an invoice", async function () {
        const response = await request(app)
            .post("/invoices")
            .send({
              comp_code: "ibm",
              amt: 100
            });
        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({
          invoice: {
            id: 4,
            comp_code: "ibm",
            amt: 100,
            paid: false,
            add_date: expect.any(String),
            paid_date: null
          }
        });
      });
    }
    );

    describe("PUT /", function () {
        test("It should update an invoice", async function () {
        const response = await request(app)
          .put("/invoices/1")
          .send({ amt: 500, paid: true });
        expect(response.body).toEqual({
          invoice: {
            id: 1,
            comp_code: "apple",
            amt: 500,
            paid: true,
            add_date: expect.any(String),
            paid_date: null,
          }
        });
      });
    }
    );
    test("It should return 404 for no-such-invoice", async function () {
        const response = await request(app)
            .put("/invoices/9999")
            .send({amt: 1000});
    
        expect(response.status).toEqual(404);
      });
    
      test("It should return 500 for missing data", async function () {
        const response = await request(app)
            .put("/invoices/1")
            .send({});
    
        expect(response.status).toEqual(500);
      })
   
    
    
    describe("DELETE /", function () {
    
      test("It should delete invoice", async function () {
        const response = await request(app)
            .delete("/invoices/1");
    
        expect(response.body).toEqual({"status": "deleted"});
      });
    
      test("It should return 404 for no-such-invoices", async function () {
        const response = await request(app)
            .delete("/invoices/999");
    
        expect(response.status).toEqual(404);
      });
    });
    
    
