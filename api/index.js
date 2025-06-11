const express = require('express');
const cors = require('cors');
const pool = require('./db')
const app = express();

// Import routes
const companyRoutes = require('./routes/companies');
const feedbackRoutes = require('./routes/feedbacks');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const statusRoutes = require('./routes/statuses');

app.use(cors());
app.use(express.json());

// Use routes
app.use('/company', companyRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/status', statusRoutes);

// App listen shit dont touch
app.listen(3003, () => {
  console.log('Servidor rodando em http://localhost:3003');
});