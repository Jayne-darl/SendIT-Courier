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
id SERIAL NOT NULL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
email VARCHAR(150) UNIQUE,
password VARCHAR NOT NULL,
is_admin BOOLEAN DEFAULT FALSE,
registered TIMESTAMP DEFAULT now(),
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
        sent_on TIMESTAMP DEFAULT now(),
        placed_by INTEGER REFERENCES users(id),
        parcel_name VARCHAR(50) NOT NULL,
        weight FLOAT NOT NULL,
        receiver_name VARCHAR(50) NOT NULL,
        receiver_phonenumber NUMERIC NOT NULL,
        destination VARCHAR(50) NOT NULL,
        pickup_location VARCHAR(50) NOT NULL,
        current_location VARCHAR(50),
        description VARCHAR(200),
        status VARCHAR(50) NOT NULL DEFAULT "pending",
        CHECK(status IN('Pending', 'Cancelled','Delivered', 'In Transit'),
        delivered_on DATE,
        updatedAt TIMESTAMP;
      )
  `;

  1	"id"	"int8"	"NO"	NULL	"nextval('parcel_order_id_seq'::regclass)"	""	NULL
2	"sent_on"	"timestamp"	"YES"	NULL	"now()"	""	NULL
3	"placed_by"	"int4"	"NO"	NULL	NULL	"public.users(id)"	NULL
4	"parcel_name"	"varchar(50)"	"NO"	NULL	NULL	""	NULL
5	"weight"	"float8"	"NO"	NULL	NULL	""	NULL
6	"receiver_name"	"varchar(50)"	"NO"	NULL	NULL	""	NULL
7	"receiver_phonenumber"	"numeric"	"NO"	NULL	NULL	""	NULL
8	"destination"	"varchar(50)"	"NO"	NULL	NULL	""	NULL
9	"pickup_location"	"varchar(50)"	"NO"	NULL	NULL	""	NULL
10	"current_location"	"varchar(50)"	"YES"	NULL	NULL	""	NULL
11	"description"	"varchar(200)"	"YES"	NULL	NULL	""	NULL
12	"status"	"varchar(50)"	"YES"	"(status)::text = ANY ((ARRAY['Pending'::character varying, 'In Transit'::character varying, 'Delivered'::character varying, 'Cancelled'::character varying])::text[])"	"'Pending'::character varying"	""	NULL
13	"delivered_on"	"date"	"YES"	NULL	NULL	""	NULL
14	"updated_at"	"timestamp"	"YES"	NULL	NULL	""	NULL
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
