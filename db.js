const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => {
  console.log("connected to the db");
});

const createTables = async () => {
  const userTable = `
    CREATE TABLE IF NOT EXISTS
      users(
        id BIGSERIAL NOT NULL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(150) UNIQUE,
        username VARCHAR(100) NOT NULL,
        registered TIMESTAMP,
        is_admin BOOLEAN,
        password VARCHAR NOT NULL
      )
  `;
  try {
    console.log("users table created!: ");
    await pool.query(userTable);
  } catch (error) {
    console.log("An error occured while creating users table: ", error);
    pool.end();
  }

  const parcelsTable = `
    CREATE TABLE IF NOT EXISTS
      parcel_order(
        id BIGSERIAL NOT NULL PRIMARY KEY,
        sent_on TIMESTAMP NOT NULL,
        placed_by INTEGER REFERENCES users(id),
        parcel_name VARCHAR(50) NOT NULL,
        weight FLOAT NOT NULL,
        receiver_name VARCHAR(50) NOT NULL,
        receiver_phonenumber NUMERIC NOT NULL,
        destination VARCHAR(50) NOT NULL,
        pickup_location VARCHAR(50) NOT NULL,
        current_location VARCHAR(50),
        description VARCHAR(200),
        status VARCHAR(50) NOT NULL,
        delivered_on DATE,
      )
  `;
  try {
    console.log("parcels table created!: ");
    await pool.query(parcelsTable);
  } catch (error) {
    console.log("An error occured while creating parcels table: ", error);
    pool.end();
  }
};

createTables().then(res => {
  console.log(res);
  console.log("All tables created");
});

const dropTable = async () => {
  const drop = `DROP TABLE IF EXISTS parcels;
                  DROP TABLE IF EXISTS users;
                  `;
  try {
    await pool.query(drop);
    console.log("tables dropped");
  } catch (error) {
    console.log("error while dropping tables", error);
    pool.end();
  }
};

pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

module.exports = {
  createTables,
  dropTable
};
