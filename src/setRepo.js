const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')

const setRepo = (repoUrl) => {
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/repo`,repoUrl)
    console.log(chalk.green("INFO")+" Completed.")
}

module.exports = {
    setRepo
}