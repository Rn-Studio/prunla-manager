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

const getFileSize = async (filePath) => {
    return fs.statSync(path.format(filePath)).size
}

const copyAPK = async (pkgName,version,apkPath) => {
    const oldApkPath = path.format(apkPath)
    const apkDir = `${path.resolve(__dirname,'..')}/stores/softs/${pkgName}/apk/`
    mkdir(apkDir)
    fs.copyFileSync(oldApkPath,`${apkDir}/${version}.apk`)
}

const writeSoftInfo = (pkgName, info) => {
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/stores/softs/${pkgName}/info.json`,JSON.stringify(info))
    let softList = {}
    try {
        softList = JSON.parse(fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/all.json`,{
            encoding: 'utf-8',
            flag: 'r'
        }))
    } catch (error) {
        softList = {
            list: []
        }
    }
    let list_find = softList.list.findIndex(e=>{return e.pkgName == info.pkgName})
    if(list_find===-1){
        softList.list.push({
            pkgName: info.pkgName,
            name: info.name,
            icon: info.icon,
            author: info.author,
            time: new Date().getTime()
        })
    } else {
        softList.list[list_find] = {
            pkgName: info.pkgName,
            name: info.name,
            icon: info.icon,
            author: info.author,
            time: new Date().getTime()
        }
    }
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/stores/all.json`,JSON.stringify(softList))
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
    let list_find = sortList.list.findIndex(e=>{return e.pkgName == softInfo.pkgName})
    if(list_find === -1) {
        sortList.list.push(softInfo)
    } else {
        sortList.list[list_find] = softInfo
    }
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/stores/${sort}.json`,JSON.stringify(sortList))
}

module.exports = {
    mkdir,
    readSoftInfo,
    copyFiles,
    copyAPK,
    writeSoftInfo,
    writeSortInfo,
    getFileSize
}