// 第三方依赖
const inquirer = require('inquirer')
const path = require('path')
const getApkInfo = require('./getApkInfo')
const chalk = require('chalk')
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

const mergeData = (old, upd, apkInfo, screenshots, iconName, apkSize) => {
    let verList = (typeof old==="undefined")?[]:old.verList
    let screenshotsList = (typeof old==="undefined")?[]:old.screenshots

    if((verList.find(e=>{return e.ver === apkInfo.version}))===undefined){
        verList.push({
            ver: apkInfo.version,
            updDate: Date.parse(new Date())
        })
    } else {
        throw Error("This APP of the same version has already exists.")
    }

    verList.sort((a, b) => {
        return compare(a.ver, b.ver)
    })

    screenshotsList.concat(screenshots)

    return {
        name: upd.name,
        date: Date.parse(new Date()),
        pkgName: apkInfo.pkgName,
        author: upd.author,
        newestVer: compare(((typeof old==="undefined")?"0.0.0":old.newestVer), apkInfo.version)===-1?old.newestVer:apkInfo.version,
        descr: upd.descr,
        sort: upd.sort,
        verList: verList,
        verCounter: verList.length,
        screenshots: screenshotsList,
        icon: iconName,
        fileSize: apkSize,
        supportList: upd.supportList.split('|'),
        unsupportList: upd.unsupportList.split('|'),
        ad: upd.ad
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
        default: storesInfo?storesInfo.sort:"NULL",
        choices: [
            "Others",
            "Faces",
            "Games",
            "Sports",
            "Chats",
            "Works",
            "News",
            "Maps",
            "Traveling",
            "Banking",
            "Images",
            "Files",
            "Broswers",
            "IME",
            "Music",
            "Video",
            "Weather",
            "Themes",
            "Home"
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
        type: "confirm",
        message: "Published by Rn Studio?",
        name: "rnStudio"
    }]).then(async ans => {
        const softPath = `${path.resolve(__dirname,'..')}/stores/softs/${softInfo.pkgName}/`
        filesManager.mkdir(softPath)
        const screenshotsFilesName = await filesManager.copyFiles(screenshotsPath,`${softPath}/screenshots/`)
        const iconName = getApkInfo.unzipIcon(apkPath,softInfo.pkgName,softInfo.iconPath)
        const newestSoftInfo = mergeData(storesInfo,ans,softInfo,screenshotsFilesName, iconName, apkSize)
        filesManager.copyAPK(softInfo.pkgName,softInfo.version,apkPath)
        filesManager.writeSoftInfo(softInfo.pkgName,newestSoftInfo)
        filesManager.writeSortInfo({
            name: ans.name,
            pkgName: softInfo.pkgName,
            icon: iconName,
            author: ans.author
        },ans.sort)
        if(ans.rnStudio){
            filesManager.writeSortInfo({
                name: ans.name,
                pkgName: softInfo.pkgName,
                icon: iconName,
                author: ans.author
            },"rnStudio")
        }
    })
}

module.exports = {
    add
}