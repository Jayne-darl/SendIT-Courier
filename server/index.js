import parcelRoute from "./routes/parcel";

const express = require("express");
const app = express();
const port = 3000;

app.use("/api/v1/parcels", parcelRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

export default app;
