const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../../app');
const { token } = require('morgan');

const test_mail = "allene40@example.net";
const test_password = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

describe('PUT /submissions/:submissionId', ()=>{

    //user verification fails
    it('Fail, unauthorized', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:"abcd"})
        .then((res) => {
            request(app).put('/submissions/1')
            .then((res)=> {
                const body = res.body;
                console.log(body);
                done();
            })
        })
        .catch(err => done(err));
    })

    // all details are not given
    it('Fail, values missing', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const token = res.body.token;
            request(app).put('/submissions/1')
            .set('Authorization', 'Bearer ' + token)
            .send({subject_id:4})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(false);
                expect(body.status).to.equal("Please do request with subject_id, title values");
                done();
            })
        })
        .catch(err => done(err));
    })

    // trying to update someone else's submission (here user_id 1 tries to update a submission of user_id 2)
    it('Fail, this is not your submission', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const token = res.body.token;
            request(app).put('/submissions/9')
            .set('Authorization', 'Bearer ' + token)
            .send({subject_id:4, title:"Eligendi qui quia molestiae quos velit temporibus.", co_authors:null})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(false);
                done();
            });
        })
        .catch(err => done(err));
    });

    // successfull update
    it('OK, submission update success', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const token = res.body.token;
            request(app).put('/submissions/1')
            .set('Authorization', 'Bearer ' + token)
            .send({subject_id:4, title:"Eligendi qui quia molestiae quos velit temporibus.", co_authors:null})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                done();
            });
        })
        .catch(err => done(err));
    });
});