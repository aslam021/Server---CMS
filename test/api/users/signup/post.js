process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../../app');

const test_mail = "unittesting@test.com";
const test_password = "test";

describe('POST /users/signup', ()=>{

    //successful register
    it('OK, registering a new user works', (done)=>{
        request(app).post('/users/signup')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const body = res.body;
            expect(body.success).to.equal(true);
            expect(body).to.contain.property('token');
            done();
        })
        .catch(err => done(err));
    })

    //email already registered
    it('Fail, email has already registered', (done)=>{
        request(app).post('/users/signup')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const body = res.body;
            expect(body.success).to.equal(false);
            expect(body.token).to.equal(null);
            expect(body.status).to.equal(test_mail + " has already registerd!");
            done();
        })
        .catch(err => done(err));
    })

    //removing a user - for test automation purpose only
    it('OK, temperory user romoved', (done)=>{
        request(app).delete('/users/signup')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const body = res.body;
            expect(body.success).to.equal(true);
            done();
        })
        .catch(err => done(err));
    })
});