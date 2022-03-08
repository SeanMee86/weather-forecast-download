const fs = require('fs');
const Axios = require('axios');
const PDFDocument = require('pdfkit');

const today = new Date(),
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    formattedDate = today.toLocaleDateString('en-US', options),
    datedFileName = `${__dirname}\\weather-forecast-${formattedDate}`,
    url = 'https://forecast.weather.gov/meteograms/Plotter.php?lat=37.4353&lon=-122.0712&wfo=MTR&zcode=CAZ508&gset=18&gdiff=3&unit=0&tinfo=PY8&ahour=0&pcmd=10000010100000000000000000000000000000000000000000000000000&lg=en&indu=1!1!1!&dd=&bw=&hrspan=48&pqpfhr=6&psnwhr=6',
    headerImage = `${__dirname}\\header_image.png`


downloadImage(url, `${datedFileName}.png`)
    .then(_ => {
        generatePdf(`${datedFileName}.png`)
            .then(_ => {
                fs.unlinkSync(`${datedFileName}.png`)
            });
    })

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

function generatePdf(image) {
    return new Promise(((resolve, reject) => {
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(`${datedFileName}.pdf`))
            .on('error', reject)
            .once('close', () => resolve())
        doc.image(headerImage, {
            width: 500,
            align: 'left'
        })
        doc.moveDown()
        doc.fontSize(20)
            .text(`Weather Forecast Information`, {
                align: 'center'
            })
        doc.fontSize(20)
            .text(formattedDate, {
                align: 'center'
            })
        doc.moveDown()
        doc.fontSize(12)
            .fillColor('blue')
            .text('https://forecast.weather.gov/MapClick.php?w0=t&w3u=1&w5=pop&w7=rain&w14u=1&w15u=1&AheadHour=0&Submit=Submit&FcstType=graphical&textField1=37.4353&textField2=-122.0712&site=all&unit=0&dd=&bw=', {
                link: 'https://forecast.weather.gov/MapClick.php?w0=t&w3u=1&w5=pop&w7=rain&w14u=1&w15u=1&AheadHour=0&Submit=Submit&FcstType=graphical&textField1=37.4353&textField2=-122.0712&site=all&unit=0&dd=&bw='
            })
        doc.moveDown()
        doc.fontSize(8)
            .fillColor('black')
            .text(' Point Forecast: Moffett Nas/Mtn Vie CA\n' +
                ' 37.44N 122.07W (Elev. 3 ft)')
        doc.image(image, {
            fit: [500, 500],
            align: 'center',
        });
        doc.end();
    }))
}
