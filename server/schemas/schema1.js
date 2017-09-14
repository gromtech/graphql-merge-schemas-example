var { GraphQLObjectType } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const workorders = require('../data/workorders');

// Construct a schema using the GraphQL schema language
const typeDefs = `
  type Workorder {
    _id: Int!
    name: String
    tasks: [Int]
    priority: String
    status: String
    completed: Boolean
  }

  type Query {
    workorders: [Workorder]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    workorders: () => workorders
  }
};

// Get a GraphQL.js Schema object
const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
  printErrors: true,
});

module.exports = schema;
