const spawn = require('child_process').spawnSync //子进程支持

// 第三方依赖
const path = require('path')
const StreamZip = require('node-stream-zip')

const runAapt = (apkPath) => {
    const info = spawn("aapt",[
                    "dump",
                    "badging",
                    path.format(apkPath)
                ])
    if(info.stderr.toString() != "") {
        console.error(info.stderr.toString())
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
        const versionRegEx = new RegExp(/(([0-9]|([1-9]([0-9]*))).){2}([0-9]|([1-9]([0-9]*)))/g)
        const version = versionRegEx.exec(out)[0]
        const iconPathRegEx = new RegExp(/application-icon-160:\'(.*)\'/g) 
        let iconPath = iconPathRegEx.exec(out)[1]
        if(path.parse(iconPath).ext==".xml"){
            iconPath = "res/mipmap-hdpi-v4/ic_launcher.png"
        }
        return {
            pkgName: pkgName,
            name: softName,
            version: version,
            iconPath: iconPath
        }
    } catch (error) {
        console.log(out)
        throw error
    }
}

const getInfo = (apkPath) => {
    const originalData = runAapt(apkPath)
    const softInfo = checkInfo(originalData)
    return softInfo
}

const unzipIcon = (apkPath,pkgName,iconPath) => {
    const icon = path.parse(iconPath)

    const zip = new StreamZip({
        file: path.format(apkPath),
        storeEntries: true
    })

    zip.on('error',err=>{
        throw err
    })

    zip.on('ready',() => {
        zip.extract(iconPath,`${path.resolve(__dirname,'..')}/stores/softs/${pkgName}/icon${icon.ext}`,err=>{
            if(err)throw err
            zip.close()
            
        })
    })
    
    return `icon${icon.ext}`
}

module.exports = {
    getInfo,
    unzipIcon
}