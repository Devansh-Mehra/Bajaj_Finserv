const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// CORS middleware to allow cross-origin requests
app.use(cors());

// Rate limiting middleware for /bfhl/data endpoint
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/bfhl/data', limiter);

// Custom error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
  });
});

app.post('/bfhl/data', (req, res, next) => {
  const requestData = req.body;

  if (!requestData.data || !Array.isArray(requestData.data)) {
    const error = new Error(
      'Invalid request data. The "data" property must be an array.'
    );
    error.status = 400;
    return next(error); // Pass the error to the error handling middleware
  }

  const numbers = [];
  const alphabets = [];
  let highestAlphabet = '';

  requestData.data.forEach((item) => {
    if (
      typeof item === 'string' &&
      item.length === 1 &&
      item.match(/[a-zA-Z]/)
    ) {
      alphabets.push(item);

      if (
        !highestAlphabet ||
        item.toLowerCase() > highestAlphabet.toLowerCase()
      ) {
        highestAlphabet = item;
      }
    } else if (!isNaN(item)) {
      numbers.push(item);
    }
  });

  const responseData = {
    is_success: true,
    user_id: 'Devansh_Mehra',
    email: 'devansh.mehra@gmail.com',
    roll_number: 'Ra20110',
    numbers: numbers,
    alphabets: alphabets,
    highest_alphabet: highestAlphabet ? [highestAlphabet] : [],
  };

  res.json(responseData);
});

app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

// Handling undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
