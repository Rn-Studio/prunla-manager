// 第三方依赖
const inquirer = require('inquirer')
const path = require('path')
const getApkInfo = require('./getApkInfo')

const add = (args) => {
    const apkPath = path.parse(args[0])
    if(apkPath.ext != ".apk") {
        throw Error("UNSUPPORTED FILE")
    }
    const softInfo = getApkInfo.getInfo(apkPath)
}

module.exports = {
    add
}