const koa = require('koa');
const koaRouter = require('koa-router');
const koaBody = require('koa-bodyparser');
const { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');
const { makeRemoteExecutableSchema, mergeSchemas } = require('graphql-tools');
const { createApolloFetch } = require('apollo-fetch');

const GRAPHQL_URL = '/graphql';
const schema1 = require('./schemas/schema1');
const schema2 = require('./schemas/schema2');

const allSchemas = {
  schema1: {
    schema: schema1,
    port: 3001,
    query: 'query { workorders }'
  },
  schema2: {
    schema: schema2,
    port: 3002,
    query: 'query { trees }'
  }
};

async function getMergedSchema(schemas) {
  const port = 3000;
  const remoteSchemasPromises = Object.keys(schemas).map((schemaName) => {
    const { port }  = schemas[schemaName];
    return makeRemoteExecutableSchema(createApolloFetch({
      uri: `http://localhost:${port}${GRAPHQL_URL}`
    }));
  });
  const remoteSchemas = await Promise.all(remoteSchemasPromises);
  return {
    schema: mergeSchemas({
      schemas: remoteSchemas
    }),
    port: 3000,
    query: "query { workorders trees }"
  };
}

function runGraphQLServer(schema, port, query) {
  const app = new koa();
  const router = new koaRouter();

  const GRAPHIQL_URL = '/graphiql';

  app.use(koaBody());

  router.post(GRAPHQL_URL, graphqlKoa({ schema: schema }));
  router.get(GRAPHQL_URL, graphqlKoa({ schema: schema }));

  router.get(GRAPHIQL_URL, graphiqlKoa({ endpointURL: '/graphql' }));
  router.get('/', async ctx => {
    ctx.redirect(`${GRAPHIQL_URL}?query=${query}`);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log('-------------------------');
  console.log(`Local web server runs at http://localhost:${port}`);
  console.log('-------------------------');
  app.listen(port);
}

async function run(schemas) {
  if (process.argv.length > 2) {
    const schemaName = process.argv[2];
    let schemaConfig;
    if (schemaName === 'merged') {
      schemaConfig = await getMergedSchema(schemas);
    } else {
      schemaConfig = schemas[schemaName];
    }
    if (schemaConfig) {
      const { schema, port, query }  = schemaConfig;
      runGraphQLServer(schema, port, query);
    } else {
      console.error(`Incorrect schema name: ${schemaName}. Allowed schemas: ${Object.keys(schemas)}`);
    }
  } else {
    console.error('Schema name is not found.');
  }
}

run(allSchemas).catch((err) => { console.error(err) });
