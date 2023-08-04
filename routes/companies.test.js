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

describe('GET /', () => {
    test('It should respond with an array of companies', async () => {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            "companies": [
                {code: "apple", name: "Apple"},
                {code: "ibm", name: "IBM"},
            ]
        });
      })
    
    });

describe('GET /apple', () => {
    test('It should return company info', async () => {
        const response = await request(app).get("/companies/apple");
        expect(response.body).toEqual(
        {
            "company": {
              code: "apple",
              name: "Apple Computer",
              description: "Maker of OSX.",
              invoices: [1,2],
            }
        }
    );
  });

  test('It should return 404 if company not found', async () => {
    const response = await request(app).get("/companies/notapple");
    expect(response.statusCode).toBe(404);
  })
});

describe('POST /', () => {
    test('It should add a new company', async () => {
        const response = await request(app).post('/companies').send({
            name: "Google",
            description: "Maker of Google.",
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            "company": {
              code: "google",
              name: "Google",
              description: "Maker of Google.",
            }
        });
    });

    test('It should return 500 for conflict', async () => {
        const response = await request(app).post('/companies').send({
            name: "Apple",
            description: "Maker of OSX.",
        });
        expect(response.statusCode).toBe(500);
    })
});

describe('PUT /', () => {
    test('It should update a company', async () => {
        const response = await request(app).put('/companies/apple').send({
            name: "AppleEdit",
            description: "New Description",
        });
        expect(response.body).toEqual({
            "company": {
              code: "apple",
              name: "AppleEdit",
              description: "New Description.",
            }
        });
    });

    test('It should return 404 if company not found', async () => {
        const response = await request(app).put('/companies/notapple').send({
            name: "Apple",
            description: "Maker of OSX.",
        });
        expect(response.statusCode).toEqual(404);
    })


test("It should return 500 for missing data", async function () {
    const response = await request(app)
        .put("/companies/apple")
        .send({});

    expect(response.status).toEqual(500);
  })
});

describe('DELETE /', () => {
    test('It should delete a company', async () => {
        const response = await request(app).delete('/companies/apple');
        expect(response.body).toEqual({status: "deleted"});
    });

    test('It should return 404 if company not found', async () => {
        const response = await request(app).delete('/companies/notapple');
        expect(response.statusCode).toEqual(404);
    })
});