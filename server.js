const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const auth = require('./router/api/auth');
const profile = require('./router/api/profile');

const PORT = process.env.PORT || 5000;

//Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/', auth);
app.use('/profile', profile);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
