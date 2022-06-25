var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const {schema,root}=require("./schema/schema");
var app = express();
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/graphql', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open',function(){
    console.log("DB Connected!");
})
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql');
})