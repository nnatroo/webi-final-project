const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect('mongodb+srv://nugonatroshvili:jFgFaBNdYH7tNIf9@cluster0.ndq7krf.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = {connectDatabase};
