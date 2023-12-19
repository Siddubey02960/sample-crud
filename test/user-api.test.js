const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const { expect } = require('chai');
chai.use(chaiHttp);

const baseUrl = '/api/users';

describe('API Tests', () => {
    let userId;
  
    it('should get all records with a GET api/users request', async () => {
      const res = await chai.request(app).get(baseUrl);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).equal(0);
    });
  
    it('should create a new object with a POST api/users request', async () => {
      const userData = {
        username: 'TestUser',
        age: 25,
        hobbies: ['Reading', 'Coding']
      };
  
      const res = await chai.request(app).post(baseUrl).send(userData);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(res.body.username).equal(userData.username);
      expect(res.body.age).equal(userData.age);
      userId = res.body.id; // Store the created user ID for future tests
    });

    it('should not give validation error with 400 code if required request data is not given for creating new user', async () => {
        const userData = {
          username: 'TestUser',
          hobbies: ['Reading', 'Coding']
        };
        const res =await chai.request(app).post(baseUrl).send(userData);
        expect(res).to.have.status(400);
        expect(res.body.error).equal('"age" is required');
      });
  
    it('should get the newly created user by its id with a GET api/users/{userId} request', async () => {
      const res = await chai.request(app).get(`${baseUrl}/${userId}`);
      expect(res).to.have.status(200);
      expect(res.body.id).equals(userId);
    });

    it('should get user by random uuid with a GET api/users/{userId} request and it should give 404 error', async () => {
        const res = await chai.request(app).get(`${baseUrl}/f47ac10b-58cc-4372-a567-0e02b2c3d480`);
        expect(res).to.have.status(404);
        expect(res.body.error).equals('User not found');
      });

    it('should get user with invalid id (not uuid) with a GET api/users/{userId} request and it should give 400', async () => {
        const res = await chai.request(app).get(`${baseUrl}/123`);
        expect(res).to.have.status(400);
        expect(res.body.error).equals('Invalid User Id');
      });  
  
    it('should update the created record with a PUT api/users/{userId} request', async () => {
      const updatedUserData = {
        username: 'UpdatedUser',
        age: 30,
        hobbies: ['Travelling']
      };
  
      const res = await chai.request(app).put(`${baseUrl}/${userId}`).send(updatedUserData);
      expect(res).to.have.status(200);
      expect(res.body.id).equals(userId);
      expect(res.body.username).equals('UpdatedUser');
    });

    it('should try to update user which does not exists with a PUT api/users/{userId} request which should give 404 error code', async () => {
        const updatedUserData = {
          username: 'UpdatedUser',
          age: 30,
          hobbies: ['Travelling']
        };
    
        const res = await chai.request(app).put(`${baseUrl}/f47ac10b-58cc-4372-a567-0e02b2c3d480`).send(updatedUserData);
        expect(res).to.have.status(404);
        expect(res.body.error).equals('User not found');
      });
  
      it('should try to update user with invalid user id with a PUT api/users/{userId} request which should give 400 error code', async () => {
        const updatedUserData = {
          username: 'UpdatedUser',
          age: 30,
          hobbies: ['Travelling']
        };
    
        const res = await chai.request(app).put(`${baseUrl}/f47`).send(updatedUserData);
        expect(res).to.have.status(400);
        expect(res.body.error).equals('Invalid User Id');
      });  

    it('should delete the created object by id with a DELETE api/users/{userId} request', async () => {
      const res = await chai.request(app).delete(`${baseUrl}/${userId}`);
      expect(res).to.have.status(204);
    });

    it('should return error when try to delete already deleted user and return 404 error', async () => {
        const res = await chai.request(app).delete(`${baseUrl}/${userId}`);
        expect(res).to.have.status(404);
      });

    it('should return error when try to delete user with invalid user id and return 400 error', async () => {
        const res = await chai.request(app).delete(`${baseUrl}/1234`);
        expect(res).to.have.status(400);
      });  
  
    it('should not get the deleted object by id with a GET api/users/{userId} request (expecting a 404 status)', async () => {
      const res = await chai.request(app).get(`${baseUrl}/${userId}`);
      expect(res).to.have.status(404);
    });
  });
