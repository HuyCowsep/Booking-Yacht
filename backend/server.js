const express = require('express');
const connectDB = require('./config/db');
const { json, urlencoded } = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma"]
}));
app.use(express.json());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));


// ACCOUNTS ROUTES
app.use('/api/v1/accounts', require('./routers/accountRouter'));
app.use('/api/v1/customers', require('./routers/customerRouter'));
// COMPANIES ROUTES
app.use('/api/v1/companies', require('./routers/companyRouter'));




// YACHTS ROUTES
app.use('/api/v1/yachts', require('./routers/yachtRouter'));


const PORT = process.env.PORT || 9999;

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));