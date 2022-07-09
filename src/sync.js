const fs = require("fs-extra")
const spawn = require('child_process').spawnSync
const time = require('silly-datetime')
const path = require("path")
const root = path.resolve(__dirname,'..')
const storesPath = `${root}/stores/`
let repo = ""

const pull = () => {
    check()
    spawn("git",[
        "pull",
        repo,
        "main"
    ],{
        cwd: storesPath,
        stdio: "inherit"
    })
}

const push = () => {
    check()
    spawn("git",[
        "add","."
    ],{
        cwd: storesPath,
        stdio: "inherit"
    })
    spawn("git",[
        "commit","-m",`Database Synced at ${time.format(new Date(),"YYYY-MM-DD HH:mm:ss")}`
    ],{
        cwd: storesPath,
        stdio: "inherit"
    })
    spawn("git",[
        "push","-u",repo,"main","--force"
    ],{
        cwd: storesPath,
        stdio: "inherit"
    })
}

const check = () => {
    if(!fs.pathExistsSync(`${root}/repo`)){
        throw Error("REPO not Configured")
    }
    repo = fs.readFileSync(`${root}/repo`).toString()
}

module.exports = {
    pull,push
}