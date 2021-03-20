const fs = require('fs');

const message = 'Por favor insira o caminho completo da pasta onde se encontram os arquivos a serem analisados';
const validatePath = path => fs.existsSync(path) ? true : 'Caminho inválido !';
const questions = [
    {
        type: 'input',
        name: 'path',
        message,
        validate: validatePath,
    }
];

module.exports = { questions };