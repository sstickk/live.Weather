const fetch = require('node-fetch');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;

exports.handler = async (event) => {
    const { city } = JSON.parse(event.body);

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${city}&per_page=1&client_id=${UNSPLASH_API_KEY}`;

    try {
        const [weatherResponse, unsplashResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(unsplashUrl)
        ]);

        const weatherData = await weatherResponse.json();
        const unsplashData = await unsplashResponse.json();

        return {
            statusCode: 200,
            body: JSON.stringify({ weatherData, unsplashData })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Something went wrong' })
        };
    }
};
