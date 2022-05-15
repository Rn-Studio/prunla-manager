const version = require('../package.json').version
const filesManager = require('./filesManager')

// 第三方依赖
const figlet = require('figlet')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')

const checkDir = () => { // 检查目录是否存在
    const storesPath = `${path.resolve(__dirname,'..')}/stores/`
    filesManager.mkdir(storesPath)
    const softsPath = `${storesPath}/softs/`
    filesManager.mkdir(softsPath)
}

const init = () => {
    console.log(
        chalk.yellowBright(
            figlet.textSync("PRUNLA MANAGER",{
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        ),
        `\n------------------------------------- ${chalk.green(version)} -------------------------------------`
    )// 输出程序名、版本号

    checkDir()
}

module.exports = {
    init
}