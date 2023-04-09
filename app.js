require('dotenv').config();
const express = require('express');
const app = express();
const port = 1812 | process.env.PORT;
const session = require('express-session');
const authRoute = require('./routes/authRoute');
const connectDB = require('./db/connectDB');
const { configPassport } = require('./utils/passport');
const passport = require('passport');
const errorHandler = require('./middleware/error-handler');
const notFoundError = require('./middleware/notFoundMiddleware');
const compression = require('compression');
const cors = require('cors');
const reteLimiter = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
configPassport();

// configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Enable other domains to access your application
app.use(cors());
app.options('*', cors());


// Compress all responses
app.use(compression());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// To remove data using these defaults, To apply data sanitization
// nosql mongo injection
app.use(mongoSanitize());
// To sanitize user input coming from POST body, GET queries, and url params  ex: '<script></script>' to convert string ''&lt;script>&lt;/script>''
app.use(xss())

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = reteLimiter({
	windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100, 
    message:
    'Too many accounts created from this IP, please try again after an 15 minutes'
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());


app.use('/api/v1/auth', authRoute);
app.use(errorHandler);
app.use(notFoundError);

const start = async () => {
  try {
    await connectDB(process.env.URI);
    app.listen(port, () => console.log(`Listen on http://localhost:${port}`));
  } catch (error) {
    console.log(error);
  }
};

start()