const { expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
const httpMock = require('node-mocks-http');

let should = chai.should();

chai.use(chaiHttp);
let server = require('../../index');
const middleware = require('../../middleware');


// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Test for Middleware', () => {
    
    describe('Check if header is passed', () => {
        it('should return 401 is header is not passed', done => {
            chai.request(server).get('/test/Rajat').end((err, resp) => {
                expect(resp.body).to.have.property('status').eq(401);
                done();
            });
        });
    });


    describe('Check if request is validated', () => {
        it('Should return status code 200 and message success', done => {
            chai.request(server).get('/test/Rajat').set({'authorization': 'Rajat'}).end((err, resp) => {
                resp.should.have.status(200);
                expect(resp.body).to.have.property('status').eq(200);
                expect(resp.body).to.have.property('message').eq("Success");
                expect(resp.body).to.deep.equal({
                    status: 200,
                    message: 'Success',
                    data: {
                        id: "Rajat"
                    }
                });

                done();
            });
        });
    });

    describe('Is middleware req returns the username', () => {
        it('Should return username from req middleware', done => {

            let req = httpMock.createRequest({
                headers:{
                    authorization: 'Rajat'
                },
                body:{
                    num: 1
                }
            });
        
            let res = httpMock.createResponse();
            var next = function () { };

            middleware.isLoggedIn(req, res, next);

            expect(req).to.have.a.property('username');
            expect(req).to.have.property('username').eq('Rajat');
            expect(req).to.have.property('evenNum').eq(10);
            done();
        });
    });
});