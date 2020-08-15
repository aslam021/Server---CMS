const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../../../app');

describe('GET /submissions/conference/:confId', ()=>{

    //respond with all submissions for this conference
    it('OK, getting all submissions gives all submissions for this conference', (done)=>{
        request(app).get('/submissions/conference/2')
        .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('submissions');
            done();
        })
        .catch(err => done(err));
    })
})