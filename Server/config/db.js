export default {
  development: {
    envVariable: 'DATABASE_URL_DEV',
    dialect: 'postgres'
  },
  production: {
    envVariable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};
