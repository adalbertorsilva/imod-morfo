const exponencialToken = 'e+';

const convertToNumber = (value) => {

    const exponencial = value;

    if(exponencial.includes(exponencialToken)) {
        const splitedValue = exponencial.split(exponencialToken);
        
        const iterator = parseInt(splitedValue[1]);
        let baseMultiplierString = '1';

        for (i = 0; i < iterator; i++) {
            baseMultiplierString = `${baseMultiplierString}0`;
        }

        return parseFloat(splitedValue[0]) * parseInt(baseMultiplierString);

    }

    return parseFloat(exponencial);
}

module.exports = { convertToNumber };