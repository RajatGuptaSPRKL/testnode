'use strict';
const {ApolloServer} = require('@apollo/server');
const {startStandaloneServer} = require('@apollo/server/standalone');
const typeDefs = require('./types/book.type');
const resolvers = require('./resolvers/book.resolver');
const mongoose = require('mongoose');
let config = require('config');

async function mongoConnect(){
    try{
        await mongoose.connect(config.db, {
            user: 'localmongouser',
            pass: 'localmongopwd',
            dbName: 'nodetestdb'
        });
        console.log("Connected to Mongo!!");
    }catch(err){
        console.log(err);
    }
}

const server = new ApolloServer({typeDefs, resolvers, includeStacktraceInErrorResponses: false});

async function startServer(){
    const {url} = await startStandaloneServer(server, {
        listen: {
            port: 4000
        }
    });
    await mongoConnect();
    console.log("Server started at url: "+url);
}

startServer();

module.exports = server;