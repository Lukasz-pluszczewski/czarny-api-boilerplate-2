import checkPassword from 'middleware/checkPassword';
import config from './config';
import routes from 'routes';

import createDatabase from './services/mongoDatabaseService';

import simpleExpress from 'services/simpleExpress';

(async function() {
  const db = await createDatabase();

  simpleExpress({
    port: config.port,
    routes,
    globalMiddlewares: [
      checkPassword(config.password),
    ],
    routeParams: { db },
  })
    .then(app => console.log(`Started on port ${app.server.address().port}`))
    .catch(error => console.error('Error', error));
})();

/*
const app = express();
  app.server = http.createServer(app);

  app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: config.corsHeaders,
  }));

  const db = await createDatabase();

  app.use(checkPassword(config.password));
  app.use(bodyParser.json({ limit: config.bodyLimit }), api({ db }));

  // starting actual server
  app.server.listen(config.port);

  console.log(`Started on port ${app.server.address().port}`); // eslint-disable-line no-console

 */