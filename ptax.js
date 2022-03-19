const axios = require('axios')
const fs = require('fs');
const csv = require('fast-csv');

const getEurToUsd = async (date) => {
    const response = await axios(`https://www3.bcb.gov.br/bc_moeda/rest/converter/1/1/978/220/${date}`);
    return response.data.value;
}

const getUsdToBrl = async (date) => {
    const response = await axios(`https://www3.bcb.gov.br/bc_moeda/rest/converter/1/1/220/790/${date}`);
    return response.data.value;
}

const convert = async (date, value) => {
    const [eurToUsd, usdToBrl] = await Promise.all([getEurToUsd(date), getUsdToBrl(date)])
    return value*eurToUsd*usdToBrl;
}

let promises = [];
fs.createReadStream('data.csv')
    .pipe(csv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', async row => promises.push(convert(row[0], row[1])))
    .on('end', () => Promise.all(promises).then(values => {
        console.log(values.reduce((acc, value) => {
            return acc + value;
        }))
    }));



