/* eslint-disable */

module.exports = {
  application: {
    port: 10000,
    cors: true,
  },
  database: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'sodam_auth',
    password: 'SodamAuth2020!',
    database: 'sodam_auth',
    migrationsTableName: '_migrations',
    migrations: ['./dist/migrations/*.js'],
    synchronize: true,
    logging: ['query', 'error'],
    extra: {
      connectionLimit: 30,
    },
    cli: {
      migrationsDir: 'migrations',
    },
  },
  authentication: {
    secret_key: 'TEST',
    master_token: 'TEST',
    sign_options: {
      expires_in_amount: 1,
      expires_in_unit: 'days',
    },
  },
}
