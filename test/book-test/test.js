process.env.NODE_ENV = 'dev';

const { expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
// const httpMock = require('node-mocks-http');

// let should = chai.should();

let server = require('../../index');
const Book = require('../../controllers/models/book');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Book Test', ()=>{
    const bookObj = {
        "title": "Javascript Guide",
        "author": "ECMA 2022",
        "year": 2022,
        "pages": 345
    };
    beforeEach(()=>{
        console.log("Before Each Called-----------");
        Book.deleteMany({}, err=>{
            console.log("EEEE", err);
            
        });
    });

    describe('Check the req body validation to create a new book', ()=>{
        it('Should return 400 and message if body is empty', done=>{
            chai.request(server).post('/book').end((err, resp)=>{
                expect(resp.body).to.have.property('status').eq(400);
                expect(resp.body).to.have.property('message').eq("Data is required");
                done();
            });
        });
        
        it('Should return 400 and message if page is not a number', done=>{
            chai.request(server).post('/book').send({
                title: bookObj.title,
                author: bookObj.author,
                year: bookObj.year,
                pages: "34534"
            }).end((err, resp)=>{
                expect(resp.body).to.have.property('status').eq(400);
                expect(resp.body).to.have.property('message').eq("Pages should be number");
                done();
            });
        });

        it('Should return 400 and message if year is not a number', done=>{
            chai.request(server).post('/book').send({
                title: bookObj.title,
                author: bookObj.author,
                year: bookObj.year.toString(),
                pages: bookObj.pages
            }).end((err, resp)=>{
                expect(resp.body).to.have.property('status').eq(400);
                expect(resp.body).to.have.property('message').eq("Year should be number");
                done();
            });
        });
    });

    // describe('Create a new book', ()=>{
    //     it('Should return message and book object', done=>{
    //         chai.request(server).post('/book').send(bookObj).end((err, resp)=>{
    //             expect(resp.body).to.have.property('message').equal('Book successfully added!');
    //             expect(resp.body.book).to.have.property('title').eq(bookObj.title);
    //             expect(resp.body.book).to.have.property('author').eq(bookObj.author);
    //             expect(resp.body.book).to.have.property('year').eq(bookObj.year);
    //             expect(resp.body.book).to.have.property('pages').eq(bookObj.pages);
    //             done();
    //         });
    //     });
    // });

    // describe('List all the books', ()=>{
    //     it('Should return message and book object', done=>{
    //         chai.request(server).post('/book').send(bookObj).end((err, resp)=>{
    //             expect(resp.body).to.have.property('message').equal('Book successfully added!');
    //             expect(resp.body.book).to.have.property('title').eq(bookObj.title);
    //             expect(resp.body.book).to.have.property('author').eq(bookObj.author);
    //             expect(resp.body.book).to.have.property('year').eq(bookObj.year);
    //             expect(resp.body.book).to.have.property('pages').eq(bookObj.pages);
    //             done();
    //         });
    //     });
    // });
    
});