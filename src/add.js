// 第三方依赖
const fs = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const getApkInfo = require('./getApkInfo')
const chalk = require('chalk')
const time = require('silly-datetime')
const filesManager = require('./filesManager')
const { compare } = require('./version')


const readSoft = (pkgName) => {
    try {
        const data = filesManager.readSoftInfo(pkgName)
        console.log(chalk.green("INFO"),"This APP has been in the Prunla Stores.")
        console.log(chalk.green("INFO"),"I recommend that you shouldn't change the sort of this APP.")
        return JSON.parse(data)
    } catch(e) {
        return undefined
    } 
}

const mergeData = async (old, upd, apkInfo, screenshots, iconName, apkSize) => {
    let verList = {}
    try {
        verList = JSON.parse(fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/softs/${apkInfo.pkgName}/version.json`,{
            encoding: 'utf-8',
            flag: 'r'
        }))
    } catch (error) {
        verList = []
    }
    let screenshotsList = (typeof old==="undefined")?[]:old.screenshots

    if((verList.find(e=>{return e.ver === apkInfo.version}))===undefined){
        verList.push({
            ver: apkInfo.version,
            updDate: time.format(new Date(),"YYYY-MM-DD")
        })
    } else {
        throw Error("This APP of the same version has already exists.")
    }

    verList = await verList.sort((a, b) => {
        return compare(a.ver, b.ver)
    })

    screenshotsList.concat(screenshots)

    let newestVer = await compare(((typeof old==="undefined")?"0.0.0":old.newestVer), apkInfo.version)===1?old.newestVer:apkInfo.version
    return {
        info: {
            name: upd.name,
            date: Date.parse(new Date()),
            pkgName: apkInfo.pkgName,
            author: upd.author,
            newestVer: newestVer,
            descr: upd.descr,
            sort: upd.sort,
            verCounter: verList.length,
            screenshots: screenshotsList,
            icon: iconName,
            fileSize: apkSize,
            supportList: upd.supportList.split('|'),
            unsupportList: upd.unsupportList.split('|'),
            ad: upd.ad,
            os: upd.os
        },
        verList: verList
    }
}

const add = async args => {
    if((args[0]) === undefined){
        throw Error("APK Path Required")
    }
    const apkPath = path.parse(args[0])
    const screenshotsPath = args.slice(1)
    if(apkPath.ext != ".apk") {
        throw Error("UNSUPPORTED FILE")
    }
    const softInfo = getApkInfo.getInfo(apkPath)
    const storesInfo = readSoft(softInfo.pkgName)
    const apkSize = await filesManager.getFileSize(apkPath)
    inquirer.prompt([{
        type: "input",
        message: "The Name of APP:",
        name: "name",
        default: storesInfo?storesInfo.name:softInfo.name
    },{
        type: "input",
        message: "The Author of APP:",
        name: "author",
        default: storesInfo?storesInfo.author:"Rn Studio"
    },{
        type: "input",
        message: "The Description of APP:",
        name: "descr",
        default: storesInfo?storesInfo.descr:"NULL"
    },{
        type: "confirm",
        message: "Contain ADs?",
        name: "ad"
    },{
        type: "list",
        message: "The Sort of APP:",
        name: "sort",
        default: storesInfo?storesInfo.sort.toLocaleUpperCase():"NULL",
        choices: [
            "OTHERS",
            "FACES",
            "GAMES",
            "SPORTS",
            "CHATS",
            "WORKS",
            "NEWS",
            "MAPS",
            "TRAVELING",
            "BANKING",
            "IMAGES",
            "FILES",
            "BROSWERS",
            "IME",
            "MUSIC",
            "VIDEO",
            "WEATHER",
            "THEMES",
            "HOME"
        ],
        filter: (ans) => {
            return ans.toLocaleLowerCase()
        }
    },{
        type: "input",
        message: "Input the Support Devices' Name, Splitted by \"|\"",
        name: "supportList",
        default: storesInfo?storesInfo.supportList.join('|'):"Unlimited"
    },{
        type: "input",
        message: "Input the Unsupport Devices' Name, Splitted by \"|\"",
        name: "unsupportList",
        default: storesInfo?storesInfo.unsupportList.join('|'):"None"
    },{
        type: "list",
        message: "Supported OS:",
        name: "os",
        default: storesInfo?storesInfo.os:"NULL",
        choices: ["Android","Wear OS","Both"]
    },{
        type: "confirm",
        message: "Published by Rn Studio?",
        name: "rnStudio"
    }]).then(async ans => {
        const softPath = `${path.resolve(__dirname,'..')}/stores/softs/${softInfo.pkgName}/`
        filesManager.mkdir(softPath)
        const screenshotsFilesName = await filesManager.copyFiles(screenshotsPath,`${softPath}/screenshots/`)
        const iconName = getApkInfo.unzipIcon(apkPath,softInfo.pkgName,softInfo.iconPath)
        const newestSoftInfo = await mergeData(storesInfo,ans,softInfo,screenshotsFilesName, iconName, apkSize)
        filesManager.copyAPK(softInfo.pkgName,softInfo.version,apkPath)
        filesManager.writeSoftInfo(softInfo.pkgName,newestSoftInfo)
        filesManager.writeSortInfo({
            softName: ans.name,
            pkgName: softInfo.pkgName,
            softIcon: iconName,
            softAuthor: ans.author,
            updatedTime: new Date().getTime()
        },ans.sort)
        if(ans.rnStudio){
            filesManager.writeSortInfo({
                softName: ans.name,
                pkgName: softInfo.pkgName,
                softIcon: iconName,
                softAuthor: ans.author,
                updatedTime: new Date().getTime()
            },"rnStudio")
        }
    })
}

module.exports = {
    add
}