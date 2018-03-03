const NODE_ENV = process.env.NODE_ENV || 'development';
const CONFIG = {
    development: {
        CORS: true,
        PORT: '8080',
        PUBLIC: '/home/fabio/public',
        DATABASE_OPTIONS: {
            dialect: "sqlite",
            storage: __dirname + "/../store/db.development.sqlite",
            define: {
                underscored: true
            }
        }
    },
    test: {
        CORS: true,
        PORT: '8080',
        PUBLIC: '/home/fabio/public',
        DATABASE_OPTIONS: {
            dialect: "sqlite",
            storage: ":memory:",
            define: {
                underscored: true
            }
        }
    },
    production: {
        CORS: true,
        PORT: '8080',
        PUBLIC: '/public',
        DATABASE_OPTIONS: {
            USERNAME: process.env.DATABASE_USERNAME,
            PASSWORD: process.env.DB_PASSWORD,
            NAME: process.env.DATABASE_NAME,
            HOST: process.env.DATABASE_HOST,
            dialect: 'mysql',
            define: {
                underscored: true
            }
        }
    }
};

const CONFIG_ENV = CONFIG[NODE_ENV];
CONFIG_ENV.NODE_ENV = NODE_ENV;

module.exports = CONFIG_ENV;
