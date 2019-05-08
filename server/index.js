import parcelRoute from "./routes/parcel";
const http = require("http");

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/v1/parcels/", parcelRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

export default app;
