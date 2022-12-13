let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();

chai.use(chaiHttp);
let server = require('../index');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Task API', ()=>{
    describe('Create a user without name and email', ()=>{
        it('should return 404 if name or email not found', (done)=>{
            chai.request(server).post('/user/create').end((err, resp)=>{
                resp.should.have.status(404);
                resp.body.should.be.a('object');
                resp.body.should.have.property('status').eq(200);
                resp.body.should.have.property('message').eq('Name and Email are required');
                done();
            });
        });

        it('should return a userobj', (done)=>{
            let userObj = {
                name: 'Rajat',
                email: 'rajat@gmail.com'
            };
            chai.request(server).post('/user/create').send(userObj).end((err, resp)=>{
                resp.should.have.status(200);
                resp.body.should.have.property('status').eql(200);
                resp.body.should.have.property('message').eql('Success');
                resp.body.should.have.property('data').eql({
                    name: userObj.name,
                    email: userObj.email
                });
                done();
            });
        });
    });
});
