const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
require('loadavg-windows');
const os = require('os');

// The GraphQL schema in string form
const typeDefs = `
  type Query {
    cpu: CPU
  }
  type CPU {
    loadavg: LoadAvg,
    cores: Int,
    normalizedLoadAvg: Float
  }
  type LoadAvg {
    oneMinuteLoadAvg: Float
    fiveMinuteLoadAvg: Float
    fifteenMinuteLoadAvg: Float
  }
`;

// The resolvers
const resolvers = {
  Query: {
    cpu: () => {
      const [
        oneMinuteLoadAvg,
        fiveMinuteLoadAvg,
        fifteenMinuteLoadAvg,
      ] = os.loadavg();

      const cores = os.cpus().length;

      const normalizedLoadAvg = oneMinuteLoadAvg / cores;

      return {
        loadavg: {
          oneMinuteLoadAvg,
          fiveMinuteLoadAvg,
          fifteenMinuteLoadAvg,
        },
        cores,
        normalizedLoadAvg,
      };
    },
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

app.use(cors());

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});