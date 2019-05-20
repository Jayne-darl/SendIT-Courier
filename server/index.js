import "@babel/polyfill";
import parcelRoute from "./routes/parcel";
import dotenv from "dotenv";

dotenv.config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1/parcels/", parcelRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

export default app;
