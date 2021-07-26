if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  }
  const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected")
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60fa8b70e91b9f164cbf8eaf',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus sit asperiores, ad cupiditate earum officiis sequi eveniet rem, dicta nobis recusandae voluptatum totam veniam harum voluptas. Asperiores porro cupiditate voluptatibus.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqw52avfm/image/upload/v1626869362/YelpCamp/goya1igq0owc0nfwyvpa.jpg',
                    filename: 'YelpCamp/wer0l0izne0pqpn7ukpe'
                },
                {
                    url: 'https://res.cloudinary.com/dqw52avfm/image/upload/v1627040094/YelpCamp/piisxwrp78rzm0u0de2x.jpg',
                    filename: 'YelpCamp/xvusnmidbuznc3fef7mx'
                }
            ]
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})