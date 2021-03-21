#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');
const { default: exec }= require('async-exec');
const moment = require('moment');
const json2xls = require('json2xls');
const emoji = require('node-emoji');
const { questions } = require('./question-manager');
const { convertToNumber } = require('./convert-exponencial-to-number');



let destinyPath;
const FILE_EXTENSION = '.mod';
const RE_SPLT = '\n';
const RE_NAME = /^NAME\W\s+.+$/;
const RE_TOTAL = /^\s+(Total.+)$/;
const NAME = 'NAME:';


const createParasiteStructurueAttributes = (attributes) => {

    return attributes.reduce((acc, value) => {
        if (value === '') return acc;

        const splitedValue = value.split('=');
        acc[splitedValue[0].trim()] = convertToNumber(splitedValue[1].trim());

        return acc;
    }, {});
}

const createXlsFile = async fileFullPath => {
    const lines = (
        await exec(`imodinfo ${fileFullPath}`)
    ).split(RE_SPLT)
    .filter(line => line.match(RE_NAME) || line.match(RE_TOTAL))
    .join('\n').trim()
    .split(NAME).filter(chunk => chunk !== '');

    const resultArray = lines.map(value => {
        const chunk = value.trim().split('\n')    
        const parasiteStructure = chunk[0];
        chunk.shift();
        return { parasiteStructure, ...createParasiteStructurueAttributes(chunk) };
    });

    const [xslName] = fileFullPath.split('/')
        .filter(path => path.includes(FILE_EXTENSION))
        .map(filename => filename.replace(FILE_EXTENSION, '.xlsx'))

    const xls = json2xls(resultArray);
    fs.writeFileSync(`${destinyPath}/${xslName}`, xls, 'binary');
}


(async () => {
    const { path } = await inquirer.prompt(questions);
    destinyPath = `${path}/${moment().format('yyyymmDDhhMMss')}`;
    
    fs.mkdirSync(destinyPath);

    const filePromises = fs.readdirSync(path)
        .filter(filename => filename.includes(FILE_EXTENSION))
        .map(filename => `${path}/${filename}`)
        .map(createXlsFile);

    await Promise.all(filePromises);

    const successMessage = emoji.emojify('-- :tada: PROCESSAMENTO FINALZADO :tada: --');
    
    console.log(successMessage);
})()