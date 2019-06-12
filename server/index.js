import express from "express";
import dotenv from "dotenv";
import "@babel/polyfill";

import parcelRoute from "./routes/parcels";
import authRoute from "./routes/authRoute";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//Template engine setup
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
});

app.use("/api/v1/parcels", parcelRoute);
app.use("/api/v1/auth", authRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

export default app;
