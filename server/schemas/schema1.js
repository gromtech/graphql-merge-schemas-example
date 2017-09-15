const { GraphQLObjectType } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const GraphQLJSON = require('graphql-type-json');
const workorders = require('../data/workorders');

// Construct a schema using the GraphQL schema language
const typeDefs = `
  scalar JSON

  type Workorder {
    _id: Int!
    name: String
    tasks: [Int]
    priority: String
    status: String
    completed: Boolean
    location: JSON
  }

  type Query {
    workorders: [Workorder]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    workorders: () => workorders
  },
  JSON: GraphQLJSON
};

// Get a GraphQL.js Schema object
const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
  printErrors: true,
});

module.exports = schema;
