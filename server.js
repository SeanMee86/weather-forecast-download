const fs = require('fs');
const Axios = require('axios');
const images = require('images');

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
    .then(res => {
        const coords = images('./images/coords.png')
        const graph = images(res);
        const height = coords.height();
        const width = (graph.width() - coords.width())/2
        images(graph.width(), height + graph.height())
            .fill(255, 255, 255)
            .draw(coords, width, 0)
            .draw(graph, 0, height)
            .save(`${__dirname}\\weather-forecast-${today.toLocaleDateString('en-US', options)}.png`)
    })


