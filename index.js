const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/keys')

require('dotenv').config();

const app = express()

app.use(cors());
app.use(express.json());

const uri = config.DBURL;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

require('./routes/dialogFlowRoutes')(app)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000
app.listen(PORT)