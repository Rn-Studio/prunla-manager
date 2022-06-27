const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

const recover = (pkgName) => {
    // 恢复文件
    fs.copySync(`${path.resolve(__dirname,'..')}/stores/unpublished/${pkgName}`,`${path.resolve(__dirname,'..')}/stores/softs/${pkgName}`)
    fs.removeSync(`${path.resolve(__dirname,'..')}/stores/unpublished/${pkgName}`)

    // 恢复分类内记录
    const info = JSON.parse(fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/softs/${pkgName}/info.json`).toString())
    let all = JSON.parse(fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/all.json`).toString())
    all.list.push({
        pkgName: info.pkgName,
        name: info.name,
        icon: info.icon,
        author: info.author
    })
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/stores/all.json`,JSON.stringify(all))

    let sortInfo = JSON.parse(fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/${info.sort}.json`).toString())
    sortInfo.list.push({
        pkgName: info.pkgName,
        name: info.name,
        icon: info.icon,
        author: info.author
    })
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/stores/${info.sort}.json`,JSON.stringify(sortInfo))

    console.log(chalk.green("INFO")+" Completed.")
}

module.exports = {
    recover
}