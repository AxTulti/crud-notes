import mongoose from 'mongoose'; // Import mongoose to connect to database
const { MONGO_URI } = process.env; // Get the URI from the environment variable

// Conection Settings
const conectionSettings = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
};

// conection with mongo
const connection = () => { 
    mongoose.connect(MONGO_URI!, conectionSettings)
    .then( () => console.log('Conected to MongoDB'))
    .catch( (err) => {
        // if error log error & exit
        console.log('Error conecting to MongoDB:');
        console.error(err);
        console.log("Exiting Database...");
        // exit process
        process.exit(1);
    });
}

// export connection
export default connection;