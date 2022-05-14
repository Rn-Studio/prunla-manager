// 第三方依赖
const inquirer = require('inquirer')
const path = require('path')
const chalk = require('chalk')

const add = (args) => {
    const apkPath = path.parse(args[0])
    if(apkPath.ext != ".apk") {
        throw Error("UNSUPPORTED FILE")
    }
}

module.exports = {
    add
}