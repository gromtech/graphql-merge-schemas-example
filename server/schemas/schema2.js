var { GraphQLObjectType } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const trees = require('../data/trees');

// Construct a schema using the GraphQL schema language
const typeDefs = `
  type Tree {
    _id: Int!
    name: String
    priority: String
    status: String
  }

  type Query {
    trees: [Tree]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    trees: () => trees
  }
};

// Get a GraphQL.js Schema object
const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
  printErrors: true,
});

module.exports = schema;
