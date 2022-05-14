#!/usr/bin/env node

const args = process.argv.slice(2)
const init = require('./init').init
const add = require('./add').add
const chalk = require('chalk')

const run = () => {
    init()
    try {
        switch(args[0]) {
            case 'add':
                add(args.slice(1))
                break;  
            default:
                break;
        }
    } catch(e) {
        console.error(chalk.bgRed("ERROR"), "Something was failed. Please check your command and try again.\n",e)
    }
}

run()