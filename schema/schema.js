const _=require("lodash");
var { buildSchema } = require('graphql');
const Book=require("../models/book");
const Author=require("../models/author");
   
var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }
  input AuthorInput{
    name:String
    age:Int
  }
  type Message {
    id: ID!
    content: String
    author: String
  }
  type Book{
    id:ID
    name:String
    genre:String,
    authorId:String
  }
  type Author{
    id:ID
    name:String
    age:Int
    books:[Book]
  }
  type Query {
    getMessage(id: ID!): Message
    book(id: ID!):Book
    books:[Book]
    author(id: ID!):Author
    authors:[Author],

  }
  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
    deleteMessage(id:ID!):Message
    addAuthor(input:AuthorInput):Author
    updateAuthor(id:ID!,input:AuthorInput):Author
    deleteAuthor(id:ID!):Author
  }
`);
class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}
var fakeDatabase = {};
 
var root = {
  getMessage: ({id}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  books:()=>{
    return Book.find({});
  },
  book:({id})=>{
    return Book.findById(id);
  },
  authors:()=>{
    return Author.find({})
    // .limit(20);
  },
  author:({id})=>{
    return Author.findById(id);
  },
  addAuthor:async({input})=>{
    let author=new Author({
        name:input.name,
        age:input.age
    });
    return await author.save();
  },
  updateAuthor:async({id,input})=>{
   let author= await Author.findByIdAndUpdate(id,{
        name:input.name,
        age:input.age
}   ,{new: true});
    if (!author) {
        throw new Error('The genre with the given ID was not found. ');
    }
    return author;
  },
  deleteAuthor:async({id})=>{
    const author = await Author.findByIdAndRemove(id);
    if (!author) {
        throw new Error('The genre with the given ID was not found. ');
    }
    return author;
  },
  createMessage: ({input}) => {
    var id = require('crypto').randomBytes(10).toString('hex');
 
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: ({id, input}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  deleteMessage:({id})=>{
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    let temp=fakeDatabase[id];
    delete fakeDatabase[id];
    return new Message(id, temp);
  }
};
module.exports={
    schema,
    root
};

