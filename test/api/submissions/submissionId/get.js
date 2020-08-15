const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../../app');

describe('GET /submissions/:submissionId', ()=>{

    //if wrong submissionId is provided no results should be returned
    it('OK, getting submission has no submission', (done)=>{
        request(app).get('/submissions/-1')
        .then((res) => {
            const body = res.body;
            expect(body.success).to.equal(false);
            expect(body.status).to.equal("no results found");
            done();
        })
        .catch(err => done(err));
    })

    //respond with 1 submission for correct suubmissionId
    it('OK, getting submission gives 1 submission', (done)=>{
        request(app).get('/submissions/1')
        .then((res) => {
            const body = res.body;
            expect(body.submission.length).to.equal(1);
            expect(body.submission[0]).to.contain.property('file');
            done();
        })
        .catch(err => done(err));
    })
})