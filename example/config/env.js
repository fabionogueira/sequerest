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
        DATABASE_DIALECT: "sqlite",
        DATABASE_OPTIONS: {
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
        DATABASE_DIALECT: 'mysql',
        DATABASE_USERNAME: process.env.DATABASE_USERNAME,
        DATABASE_PASSWORD: process.env.DB_PASSWORD,
        DATABASE_NAME: process.env.DATABASE_NAME,
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_OPTIONS: {
            define: {
                underscored: true
            }
        }
    }
};

const CONFIG_ENV = CONFIG[NODE_ENV];
CONFIG_ENV.NODE_ENV = NODE_ENV;

if (NODE_ENV == 'development'){
    console.log('database:', CONFIG_ENV.DATABASE_STORAGE);
}

module.exports = CONFIG_ENV;
