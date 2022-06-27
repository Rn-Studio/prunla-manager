#!/usr/bin/env node

const args = process.argv.slice(2)
const init = require('./init').init
const add = require('./add').add
const chalk = require('chalk')
const { remove } = require('./remove')
const { recover } = require('./recover')
const { setRepo } = require('./setRepo')

const run = async () => {
    init()
    try {
        switch(args[0].toLocaleLowerCase()) {
            case 'add':
                await add(args.slice(1))
                break;
            case 'remove':
            case 'rm':    
                remove(args.slice(1)[0])  
                break;
            case 'recover':
            case 'rc':
                recover(args.slice(1)[0]) 
                break;
            case 'setrepo':
                setRepo(args.slice(1)[0]) 
                break;           
            default:
                break;
        }
    } catch(e) {
        console.error(chalk.bgRed("ERROR"), "Something was failed. Please check your command and try again.\n",e)
    }
}

run()