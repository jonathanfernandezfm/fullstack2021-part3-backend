const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

morgan.token('body', function (req, res) {
	return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body '));
app.use(express.json());
app.use(cors());

let persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1,
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 2,
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3,
	},
	{
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
		id: 4,
	},
];

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
	response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const note = persons.find((note) => note.id === id);

	if (note) response.json(note);
	else response.status(404).end();
});

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'parameters missing',
		});
	}

	const exists = persons.find((p) => p.name === body.name);
	if (exists) {
		return response.status(400).json({
			error: 'name must be unique',
		});
	}

	const note = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 10 ** 6),
	};

	persons = persons.concat(note);
	response.json(note);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((note) => note.id !== id);

	response.status(204).end();
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
