const fs = require('fs-extra')
const path = require('path')

const mkdir = (dir) => {
    if(!fs.pathExistsSync(dir))fs.mkdirSync(dir)
}

const readSoftInfo = (pkgName) => {
    return fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/softs/${pkgName}/info.json`,{
        encoding: 'utf-8',
        flag: 'r'
    })
}

const copyFiles = async (files,dir) => {
    let arr = []
    mkdir(dir)
    await files.forEach(filePath => {
        const fileInfo = path.parse(filePath)
        const fileName = `${fileInfo.name}${fileInfo.ext}`
        fs.copyFileSync(filePath,`${dir}/${fileName}`)
        arr.push(fileName)
    });
    return arr
}

const copyAPK = async (pkgName,version,apkPath) => {
    const oldApkPath = path.format(apkPath)
    const apkDir = `${path.resolve(__dirname,'..')}/stores/softs/${pkgName}/apk/`
    mkdir(apkDir)
    fs.copyFileSync(oldApkPath,`${apkDir}/${version}.apk`)
}

const writeSoftInfo = (pkgName, info) => {
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/stores/softs/${pkgName}/info.json`,JSON.stringify(info))
}

const writeSortInfo = (softInfo, sort) => {
    let sortList = {}
    try {
        sortList = JSON.parse(fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/${sort}.json`,{
            encoding: 'utf-8',
            flag: 'r'
        }))
    } catch (error) {
        sortList = {
            list: []
        }
    }
    if((sortList.list.find(e=>{return e.pkgName == softInfo.pkgName})=== undefined)){
        sortList.list.push(softInfo)
    }
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/stores/${sort}.json`,JSON.stringify(sortList))
}

module.exports = {
    mkdir,
    readSoftInfo,
    copyFiles,
    copyAPK,
    writeSoftInfo,
    writeSortInfo
}