const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/bfhl/data', (req, res) => {
  const requestData = req.body;

  if (!requestData.data || !Array.isArray(requestData.data)) {
    return res.status(400).json({
      error: 'Invalid request data. The "data" property must be an array.',
    });
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
