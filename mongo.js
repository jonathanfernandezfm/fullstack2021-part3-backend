const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password>');
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@fullstackopen2021.4tcub.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
	name: String,
	number: Number,
});

const Person = mongoose.model('Person', personSchema);

const name = process.argv[3];
const number = process.argv[4];

if (name && number) {
	const person = new Person({
		name,
		number,
	});

	person.save().then(() => {
		console.log(`added ${name} number ${number} to phonebook`);
		mongoose.connection.close();
	});
} else {
	Person.find({}).then((result) => {
		console.log('Phonebook:');
		result.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});

		mongoose.connection.close();
	});
}
