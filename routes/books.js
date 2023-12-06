const express = require('express');
const router = express.Router();

let books = require('../data');

const Joi = require('joi');
const booksSchema = Joi.object({
    title: Joi.string().required().label('Titulo'),
    author: Joi.string().required().label('Autor'),
});


router.get('/', (req, res, next) => {
    try {
        res.json(books);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        const book = books.find(book => book.id === id);

        if (!book) {
            const error = new Error ('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        res.json(book);
    } catch (err) {
        next(err);
        
    }
});

router.post('/', (req, res, next) => {
    try {
        const { error, value } = booksSchema.validate(req.body);

        if (error) {
            const validateError = new Error ('Error de validación');
            validateError.status = 400;
            validateError.details = error.details.map( detail => detail.message );
            throw validateError
        }

        const { title, author } = value;

        const newBook = {
            id: books.length + 1,
            title,
            author
        };

        books.push(newBook);

        res.status(201).json(newBook);
    } catch (err) {
        next(err)
    }
});

router.put('/:id', (req, resp, next) => {
    try {
        const id = req.params.id;
        const { error, value } = booksSchema.validate(req.body);
        if (error){
            const validateError = new Error('Error de validación');
            validateError.status = 400;
            validateError.detail = error.details.map( detail => detail.message );
            throw validateError;
        }

        const { title, author } = value;
        const book = books.find( book => book.id === id );

        if (!book ) {
            const error = new Error('Libro no encontrado')
            error.status = 404;
            throw error;
        }

        book.title = title || book.title;
        book.author = author || book.author;

        res.json(book);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        const book = books.find( book => book.id === id );

        if (!book) {
            const error = new Error('No se encuentra el libro');
            error.status = 404;
            throw error; 
        }

        books = books.filter(book => book.id !== id);
        res.json(book);

    } catch (err) {
        next(err)
        
    }
});

module.exports = router;