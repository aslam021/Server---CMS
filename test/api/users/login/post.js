const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../../app');

const test_mail = "allene40@example.net";
const test_password = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

describe('POST /users/login', ()=>{

    //successful login
    it('OK, login works', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const body = res.body;
            expect(body.success).to.equal(true);
            expect(body).to.contain.property('token');
            expect(body).to.contain.property('details');
            done();
        })
        .catch(err => done(err));
    })

    //password invalid
    it('Fail, wrong password', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password+"hi"})
        .then((res) => {
            const body = res.body;
            expect(body.success).to.equal(false);
            expect(body.token).to.equal(null);
            done();
        })
        .catch(err => done(err));
    })

    //password invalid
    it('Fail, email have not registred', (done)=>{
        request(app).post('/users/login')
        .send({email:"tgdbsjsibqww732e65211@scb.ujk", password:test_password})
        .then((res) => {
            const body = res.body;
            expect(body.success).to.equal(false);
            expect(body.token).to.equal(null);
            done();
        })
        .catch(err => done(err));
    })
});