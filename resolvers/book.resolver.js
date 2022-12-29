const BookModel = require('../controllers/models/book');
const AuthorModel = require('../controllers/models/author');
const { GraphQLScalarType, GraphQLError, Kind } = require('graphql');

const ObjectId = require('mongoose').Types.ObjectId;

/* 
Customer Email Address Scalar : Starts Here
*/

const EMAIL_ADDRESS_REGEXP = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validate = value => {
    if (typeof value != "string") {
        throw new GraphQLError('Entered email is not a string');
    }

    if (!EMAIL_ADDRESS_REGEXP.test(value)) {
        throw new GraphQLError('Email is not valid: ' + value, {
            extensions: {
                code: "BAD_DATA"
            }
        });
    }

    return value;
}

const parsedLiteral = ast => {
    if (ast.kind !== Kind.STRING) {
        throw new GraphQLError('Query error: Can only parse string as email address but got a :' + ast.kind);
    }

    return validate(ast.value);
}

const emailAddress = new GraphQLScalarType({
    name: 'EmailAddress',
    description: "A valid email address",
    parseValue: validate,
    serialize: validate,
    parseLiteral: parsedLiteral
});

/* 
Ends Here
*/

const resolvers = {
    Query: {
        fetchAllBooks: async (_, { query }) => {
            try {
                let allBooks = await findBook({ query });
                if (allBooks.length) {
                    return { books: allBooks, status: 200, message: "Book List" };
                } else {
                    return { books: [], status: 400, message: "No book found" };
                }
            } catch (error) {
                return {
                    status: 400,
                    message: error + ""
                }
            }
        },
        findBook: async (_, { title, year, id, author }) => {
            if (title || year || id) {
                let response = await findBook(title, year, id);
                return response[0];
            } else {
                return {
                    status: 404,
                    message: "Nothing found. Please pass a query to find the book"
                }
            }
        },
    },
    Book: {
        category: (parent) => {
            if (parent.pages >= 400) {
                return {
                    category: "Too Long to Read"
                }
            } else {
                return {
                    category: "Quick Read Time"
                }
            }
        }
    },
    AllBooks: {
        __resolveType(obj) {
            if (obj.books) {
                return "BookSuccessResponse";
            }
            if (!obj.books.length) {
                return "BookErrorResponse";
            }

            return null;
        }
    },
    Mutation: {
        addNewBook: async (_, args, context) => {
            try {
                // First create the Author
                let author = await findOrCreateAuthor(args.book.author);
                let book = await findOrCreateBook({ ...args.book, author: author.id });
                if (book.newCreated) {
                    return { status: 200, message: 'New book added successfully', id: book.id }
                } else {
                    return { status: 409, message: "Book already exists", id: book.id };
                }
            } catch (err) {
                return {
                    status: 400,
                    message: "" + err
                }
            }
        }
    },
    // Customer Scalar Resolver
    EmailAddress: emailAddress
};

function findBook({ title, year, id, query }) {
    return new Promise(async (resolve, reject) => {
        try {
            let findQuery = {
                '$and': []
            };
            if (title) {
                findQuery['$and'].push({
                    title
                });
            }

            if (year) {
                findQuery['$and'].push({
                    year
                });
            }

            if (id) {
                let bookID = new ObjectId(id);
                findQuery['$and'].push({
                    _id: bookID
                });
            }

            if (query) {
                findQuery['$and'].push({
                    '$or': [{
                        'title': {
                            '$regex': new RegExp(query, 'i')
                        }
                    }]
                });
            }

            let matchQuery = [];
            if (findQuery['$and'].length) {
                matchQuery.push({
                    '$match': findQuery,
                });
            }

            matchQuery.push({
                '$lookup': {
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorData'
                }
            });

            matchQuery.push(
                { $unwind: '$authorData' },
            );

            matchQuery.push({
                '$addFields': {
                    'authorInfo': {
                        'name': '$authorData.name',
                        'email': '$authorData.email',
                        'id': '$authorData._id'
                    },
                    'id': '$_id'
                }
            });
            matchQuery.push({
                '$project': {
                    id: 1,
                    title: 1,
                    year: 1,
                    pages: 1,
                    authorInfo: 1,
                    createdAt: 1
                }
            });

            let singleBook = await BookModel.aggregate(matchQuery).exec();
            resolve(singleBook);
        } catch (error) {
            reject(error);
        }
    });
}

function findOrCreateAuthor(authorObj) {
    return new Promise(async (resolve, reject) => {
        try {
            // Step 1. Check if author already exists
            let authorInstance = await AuthorModel.findOne({
                name: new RegExp(authorObj.name, 'i')
            }).exec();

            if (authorInstance) {
                resolve({
                    newCreated: false,
                    id: authorInstance._id
                });
            } else {
                let author = new AuthorModel({ name: authorObj.name, email: authorObj.email });
                author.save((err, authorResp) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            newCreated: true, id: authorResp._id
                        });
                    }
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

function findOrCreateBook(bookObj) {
    return new Promise(async (resolve, reject) => {
        try {
            let book = await BookModel.findOne({
                title: bookObj.title
            }).exec();

            if (book) {
                resolve({
                    newCreated: false, id: book._id
                });
            } else {
                // After creating author, create the new book
                let resp = await BookModel.create({ title: bookObj.title, year: bookObj.year, pages: bookObj.pages, author: bookObj.author });
                resolve({ newCreated: true, id: resp._id });
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = resolvers;