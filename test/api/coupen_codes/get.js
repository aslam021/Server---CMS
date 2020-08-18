const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');

const test_mail = "allene40@example.net";
const test_password = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
const conferenceId = 1;

describe('GET /coupens', ()=>{

    //all coupen_codes for only this conference should be returned
    it('OK, all coupen_codes returned for a particular conference', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const token = res.body.token;
            request(app).get('/coupens')
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body).to.contain.property('coupenData');
                if (body.length > 0 ){
                    expect(body.coupenData[0].conference_id).to.equal(conferenceId); //ensuring only reqested conference's coepens are retrived

                    expect(body.coupenData[body.length-1].conference_id).to.equal(conferenceId);
                }
                done();
            });
        })
        .catch(err => done(err));
    });
})