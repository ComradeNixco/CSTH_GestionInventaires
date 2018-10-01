require('dotenv-safe').config({ allowEmptyValues: true });

let seeder = require('mongoose-seed');

let mngConnectionStr = 'mongodb://';
if (process.env.MONGO_USERNAME != '') {
  mngConnectionStr += process.env.MONGO_USERNAME;
  mngConnectionStr += `:${process.env.MONGO_PASSWD}@`;
}
mngConnectionStr += process.env.MONGO_HOST;
if (process.env.MONGO_PORT != '') mngConnectionStr += `:${process.env.MONGO_PORT}`;
mngConnectionStr += `/${process.env.MONGO_DB_NAME}`;

seeder.connect(mngConnectionStr, () => {
  const baseModelsUrl = './models';
  seeder.loadModels([
    baseModelsUrl + '/user.js'
  ]);

  seeder.clearModels([
    'User'
  ], () => {
    seeder.populateModels(require('./data.json'), () => {
      seeder.disconnect();
    });
  });
});