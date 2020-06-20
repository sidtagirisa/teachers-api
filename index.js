const express = require('express');
const path = require('path');
const logger = require('./src/middleware/logger');
const cors = require('cors');
import router from './src/routes';

const app = express();

// Init middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// User routes
app.use('/api', router);

// App config
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
