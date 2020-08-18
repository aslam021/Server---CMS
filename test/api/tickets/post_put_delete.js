const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');

const test_mail = "allene40@example.net";
const test_password = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
const test_mail2 = "bernhard.jesse@example.org";
const test_password2 = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
const conferenceId = 5;
const coupon_code = null;
const type = null;
const price = null;

let insertId;

describe('POST /tickets', ()=>{

    //all tickets bought only by this user for only this conference should be returned
    it('OK, all tickets returned for a particular user for a particular conference', (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const token = res.body.token;
            request(app).post('/tickets')
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId, 'coupon_code':coupon_code, 'type':type, 'price':price})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body.ticketData.affectedRows).to.equal(1);

                insertId = body.ticketData.insertId;
                done();
            });
        })
        .catch(err => done(err));
    });
})


describe(`PUT /tickets/:ticketId`, ()=>{

    //trying to modify someone else's ticket details should fail
    //here user 2 going to modify the ticket bought by user 1 in above test case
    it('Fail, trying to modify someone else\'s ticket details',  (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail2, password:test_password2})
        .then((res) => {
            const token = res.body.token;
            request(app).put(`/tickets/${insertId}`)
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId, 'coupon_code':coupon_code, 'type':type, 'price':price})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body.ticketData.affectedRows).to.equal(0); //no rows should be affected
                done();
            });
        })
        .catch(err => done(err));
    });


    //modifying own ticket details should work
    it('Ok, tickets details should be modified',  (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const token = res.body.token;
            request(app).put(`/tickets/${insertId}`)
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId, 'coupon_code':coupon_code, 'type':type, 'price':price})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body.ticketData.affectedRows).to.equal(1); //1 row should be affected
                done();
            });
        })
        .catch(err => done(err));
    });
});



describe(`DELETE /tickets/:ticketId`, ()=>{

    //trying to delete someone else's ticket details should fail
    //here user 2 going to delete the ticket bought by user 1 in above test case
    it('Fail, trying to delete someone else\'s ticket details',  (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail2, password:test_password2})
        .then((res) => {
            const token = res.body.token;
            request(app).delete(`/tickets/${insertId}`)
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body.ticketData.affectedRows).to.equal(0); //no rows should be affected
                done();
            });
        })
        .catch(err => done(err));
    });


    //deleting own ticket details should work
    it('Ok, tickets details should be deleted',  (done)=>{
        request(app).post('/users/login')
        .send({email:test_mail, password:test_password})
        .then((res) => {
            const token = res.body.token;
            request(app).delete(`/tickets/${insertId}`)
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body.ticketData.affectedRows).to.equal(1); //1 row should be affected
                done();
            });
        })
        .catch(err => done(err));
    });
});