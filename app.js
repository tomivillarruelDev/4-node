const express = require('express');
const app = express();
app.use(express.json());

const booksRouter = require('./routes/books');

const errorHandler = require('./middlewares/errorHandler');

app.use('/books', booksRouter);
app.use(errorHandler);

app.listen( 3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});