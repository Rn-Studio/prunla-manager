const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')

const remove = (pkgName) => {
    fs.copySync(`${path.resolve(__dirname,'..')}/stores/softs/${pkgName}`,`${path.resolve(__dirname,'..')}/stores/unpublished/${pkgName}`)
    fs.removeSync(`${path.resolve(__dirname,'..')}/stores/softs/${pkgName}`)
    const sort = JSON.parse(fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/unpublished/${pkgName}/info.json`).toString()).sort
    let all = JSON.parse(fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/all.json`).toString())
    let index = all.list.findIndex(e=>{return e.pkgName==pkgName})
    all.list.splice(index,1)
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/stores/all.json`,JSON.stringify(all))
    let sortInfo = JSON.parse(fs.readFileSync(`${path.resolve(__dirname,'..')}/stores/${sort}.json`).toString())
    index = sortInfo.list.findIndex(e=>{return e.pkgName==pkgName})
    sortInfo.list.splice(index,1)
    fs.writeFileSync(`${path.resolve(__dirname,'..')}/stores/${sort}.json`,JSON.stringify(sortInfo))
    console.log(chalk.green("INFO")+" Completed.")
}

module.exports = {
    remove
}