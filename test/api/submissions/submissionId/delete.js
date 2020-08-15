const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../../app');
const { token } = require('morgan');

const test_mail = "bernhard.jesse@example.org";
const test_password = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

describe('DELETE /submissions/:submissionId', ()=>{

    // trying to delete someone else's submission (here user_id 2 tries to delete a submission of user_id 1)
    it('Fail, this is not your submission', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const token = res.body.token;
            request(app).delete('/submissions/1')
            .set('Authorization', 'Bearer ' + token)
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(false);
                done();
            });
        })
        .catch(err => done(err));
    });

    // successfull delete
    // it('OK, submission update success', (done)=>{
    //     request(app).post('/users/login')
    //     .send({email:test_mail, password:test_password})
    //     .then((res) => {
    //         const token = res.body.token;
    //         request(app).put('/submissions/1')
    //         .set('Authorization', 'Bearer ' + token)
    //         .send({subject_id:4, title:"Eligendi qui quia molestiae quos velit temporibus.", co_authors:null})
    //         .then((res) => {
    //             const body = res.body;
    //             expect(body.success).to.equal(true);
    //             done();
    //         });
    //     })
    //     .catch(err => done(err));
    // });

    // admin can delete any submission
    // it('Fail, this is not your submission', (done)=>{
    //     request(app).post('/users/login')
    //     .send({email:test_mail, password:test_password})
    //     .then((res) => {
    //         const token = res.body.token;
    //         request(app).put('/submissions/9')
    //         .set('Authorization', 'Bearer ' + token)
    //         .send({subject_id:4, title:"Eligendi qui quia molestiae quos velit temporibus.", co_authors:null})
    //         .then((res) => {
    //             const body = res.body;
    //             expect(body.success).to.equal(false);
    //             done();
    //         });
    //     })
    //     .catch(err => done(err));
    // });
});