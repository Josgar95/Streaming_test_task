const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false
    }
);

sequelize.authenticate()
    .then(() => console.log("DB connesso correttamente"))
    .catch(err => console.error("Errore connessione DB:", err));

module.exports = sequelize;