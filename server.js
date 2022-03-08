const fs = require('fs');
const Axios = require('axios');

const url = 'https://forecast.weather.gov/meteograms/Plotter.php?lat=37.4353&lon=-122.0712&wfo=MTR&zcode=CAZ508&gset=18&gdiff=3&unit=0&tinfo=PY8&ahour=0&pcmd=10000010100000000000000000000000000000000000000000000000000&lg=en&indu=1!1!1!&dd=&bw=&hrspan=48&pqpfhr=6&psnwhr=6'
const today = new Date(),
options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

async function downloadImage(url, filepath) {
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath));
    });
}

downloadImage(url, `${__dirname}\\weather-forecast-${today.toLocaleDateString('en-US', options)}.png`)
    .then(_ => console.log('done'))


