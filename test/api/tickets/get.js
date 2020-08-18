const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');

const test_mail = "allene40@example.net";
const test_password = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
const conferenceId = 5;

describe('GET /tickets', ()=>{

    //all tickets bought only by this user for only this conference should be returned
    it('OK, all tickets returned for a particular user for a particular conference', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const token = res.body.token;
            request(app).get('/tickets')
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body).to.contain.property('ticketData');
                if (body.length > 0 ){
                    expect(body.ticketData[0].user_id).to.equal(1);
                    expect(body.ticketData[0].conference_id).to.equal(conferenceId);

                    expect(body.ticketData[body.length-1].user_id).to.equal(1);
                    expect(body.ticketData[body.length-1].conference_id).to.equal(conferenceId);
                }
                done();
            });
        })
        .catch(err => done(err));
    });
})