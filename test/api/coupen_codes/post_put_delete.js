const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');

const admin_mail = "allene40@example.net";
const admin_password = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
const author_mail = "bernhard.jesse@example.org";
const author_password = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
const conferenceId = 5;
const vendor = 'Ernser PLC';
const coupen_code = 'H7KEQ';
const discount = null;


describe('POST /coupens', ()=>{

    //other than admins can not add new coupens
    it('Fail, only admin can add coupens', (done)=>{
        request(app).post('/users/login')
        .send({email:author_mail, password:author_password})
        .then((res) => {
            const token = res.body.token;
            request(app).post('/coupens')
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId, 'coupen_code':coupen_code, 'vendor':vendor, 'discount':discount})
            .then((res) => {
                expect(res.statusCode).to.equal(403);
                done();
            });
        })
        .catch(err => done(err));
    });

    //admins can add new coupens
    it('OK, coupen added', (done)=>{
        request(app).post('/users/login')
        .send({email:admin_mail, password:admin_password})
        .then((res) => {
            const token = res.body.token;
            request(app).post('/coupens')
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId, 'coupen_code':coupen_code, 'vendor':vendor, 'discount':discount})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body.coupenData.affectedRows).to.equal(1);
                done();
            });
        })
        .catch(err => done(err));
    });
});


describe('PUT /coupens', ()=>{

    //other than admins can not modify a coupen
    it('Fail, only admin can modify a coupen', (done)=>{
        request(app).post('/users/login')
        .send({email:author_mail, password:author_password})
        .then((res) => {
            const token = res.body.token;
            request(app).put('/coupens')
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId, 'coupen_code':coupen_code, 'vendor':vendor, 'discount':discount})
            .then((res) => {
                expect(res.statusCode).to.equal(403);
                done();
            });
        })
        .catch(err => done(err));
    });

    //admins can modify a coupen details
    it('OK, coupen updated', (done)=>{
        request(app).post('/users/login')
        .send({email:admin_mail, password:admin_password})
        .then((res) => {
            const token = res.body.token;
            request(app).put('/coupens')
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId, 'coupen_code':coupen_code, 'vendor':vendor, 'discount':discount})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body).to.contain.property('coupenData');
                done();
            });
        })
        .catch(err => done(err));
    });
});



describe('DELETE /coupens', ()=>{

    //other than admins can not delete a coupen
    it('Fail, only admin can delete a coupen', (done)=>{
        request(app).post('/users/login')
        .send({email:author_mail, password:author_password})
        .then((res) => {
            const token = res.body.token;
            request(app).delete('/coupens')
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId, 'coupen_code':coupen_code})
            .then((res) => {
                expect(res.statusCode).to.equal(403);
                done();
            });
        })
        .catch(err => done(err));
    });

    //admins can delete a coupen details
    it('OK, coupen deleted', (done)=>{
        request(app).post('/users/login')
        .send({email:admin_mail, password:admin_password})
        .then((res) => {
            const token = res.body.token;
            request(app).delete('/coupens')
            .set('Authorization', 'Bearer ' + token)
            .send({'conferenceId': conferenceId, 'coupen_code':coupen_code})
            .then((res) => {
                const body = res.body;
                expect(body.success).to.equal(true);
                expect(body.coupenData.affectedRows).to.equal(1);
                expect(body.status).to.equal(`${coupen_code} deleted`);
                done();
            });
        })
        .catch(err => done(err));
    });
});