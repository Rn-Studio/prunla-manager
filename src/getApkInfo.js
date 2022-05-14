const spawn = require('child_process').spawnSync //子进程支持

// 第三方依赖
const path = require('path')

const runAapt = (apkPath) => {
    const info = spawn("aapt",[
                    "dump",
                    "badging",
                    path.format(apkPath)
                ])
    if(info.stderr.toString() != "") {
        console.error(info.stderr)
        throw Error('GET APK Info Failed')
    }
    return info.stdout.toString()            
}

const checkInfo = (out) => {
    try {
        const packageNameRegEx = new RegExp(/name=\'(.*)\' versionCode/g)
        const pkgName = packageNameRegEx.exec(out)[1]
        const softNameRegEx = new RegExp(/application\-label\:\'(.*)\'/g)
        const softName = softNameRegEx.exec(out)[1]
        const versionRegEx = new RegExp(/versionName=\'(.*)'/g)
        const version = versionRegEx.exec(out)[1]
        return {
            pkgName: pkgName,
            name: softName,
            version: version
        }
    } catch (error) {
        throw error
    }
}

const getInfo = (apkPath) => {
    const originalData = runAapt(apkPath)
    const softInfo = checkInfo(originalData)
    return softInfo
}

module.exports = {
    getInfo
}