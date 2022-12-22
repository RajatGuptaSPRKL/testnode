'use strict';
// const { ApolloServer } = require('@apollo/server');
// const { startStandaloneServer } = require('@apollo/server/standalone');
const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const bookTypeDefs = require('./types/book.type');
const bookResolver = require('./resolvers/book.resolver');
// const apolloServer = new ApolloServer({ typeDefs: bookTypeDefs, resolvers: bookResolver });

const app = express();

// const schema = buildSchema(`
// type Book {
//     title: String!
//     author: String!
//     year: Int!
//     pages: Int!
//     createdAt: String!
// }

// input NewBookInput {
//     title: String
//     author: String
//     year: Int
//     pages: Int
//     createdAt: String
// }

// type AddNewBookResponse {
//     status: Int!
//     message: String!
// }

// type Query {
//     getAllBooks: [Book]
// }

// type Mutation {
//     addNewBook(title: String!, author: String!, year: Int!, pages: Int!, createdAt: String!): AddNewBookResponse!
// }
// `);
const mongoose = require('mongoose');
const morgan = require('morgan');
let config = require('config');

async function mongoConnect() {
    try {
        await mongoose.connect(config.db, {
            user: 'localmongouser',
            pass: 'localmongopwd',
            dbName: 'nodetestdb'
        });
        console.log("Connected to Mongo!!");
    } catch (err) {
        console.log(err);
    }
}

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    // app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(bookTypeDefs),
    rootValue: {...bookResolver.Query, ...bookResolver.Mutation},
    graphiql: true
}));

app.listen(3000, async ()=>{
    await mongoConnect();
    console.log("Server is running on port 3000");
});

// (async () => {
//     const { url } = await startStandaloneServer(apolloServer, {
//         listen: {

//             port: 3000
//         },
//         context: ({req, res}) =>{
//             return { name: "Rajat Gupta"} 
//         }
//     });
//     mongoConnect();
//     console.log("Server ready at " + url);
// })();

