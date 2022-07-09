const version = require('../package.json').version
const filesManager = require('./filesManager')

// 第三方依赖
const figlet = require('figlet')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const spawn = require('child_process').spawnSync

const storesPath = `${path.resolve(__dirname,'..')}/stores/`

const checkDir = () => { // 检查目录是否存在
    filesManager.mkdir(storesPath)
    const softsPath = `${storesPath}/softs/`
    filesManager.mkdir(softsPath)
    const unpublishedPath = `${storesPath}/unpublished/`
    filesManager.mkdir(unpublishedPath)
    fs.writeFileSync(`${storesPath}/index.html`,"PRUNLA STORE")
}

const checkRepo = () => {
    if(!fs.pathExistsSync(`${storesPath}/.git/`)) {
        spawn("git",[
            "init"
        ],{
            cwd: storesPath
        })
    }
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
    checkRepo()
}

module.exports = {
    init
}