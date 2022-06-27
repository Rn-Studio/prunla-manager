#!/usr/bin/env node

const args = process.argv.slice(2)
const init = require('./init').init
const add = require('./add').add
const chalk = require('chalk')
const { remove } = require('./remove')
const { recover } = require('./recover')
const { setRepo } = require('./setRepo')
const { pull, push } = require('./sync')

const run = async () => {
    init()
    try {
        let cmd = args[0]
        if(cmd) cmd = cmd.toLocaleLowerCase()
        switch(cmd) {
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
            case 'pull':
                pull()
                break;
            case 'push':
                push()
                break;                 
            default:
                break;
        }
    } catch(e) {
        console.error(chalk.bgRed("ERROR"), "Something was failed. Please check your command and try again.\n",e)
    }
}

run()