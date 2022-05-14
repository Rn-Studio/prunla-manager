const version = require('../package.json').version

// 第三方依赖
const figlet = require('figlet')
const chalk = require('chalk')

const init = () => {// 输出程序名、版本号
    console.log(
        chalk.yellowBright(
            figlet.textSync("PRUNLA MANAGER",{
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        ),
        `\n------------------------------------- ${chalk.green(version)} -------------------------------------`
    )
}

module.exports = {
    init
}