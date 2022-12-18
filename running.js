const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function() {
  // we're connected!
const run = new mongoose.Schema({
  name: String
})
const app = mongoose.model('App', run);

const running = new app({ name: 'App is running!' });
console.log(running.name); 
});

//demonstrating mongoose

//to run it:   node running.js