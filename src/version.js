const compare = async (v1, v2) => {
    let v1Arr = v1.split('.')
    let v2Arr = v2.split('.')
    const len = Math.max(v1Arr.length, v2Arr.length)
    while(v1Arr.length < len) {
        v1Arr.push('0')
    }
    while(v2Arr.length < len) {
        v2Arr.push('0')
    }

    for(let i=0;i<len;i++) {
        const num1 = parseInt(v1Arr[i])
        const num2 = parseInt(v2Arr[i])

        if(num1 > num2)return 1;
        if(num1 < num2)return -1
    }

    return 0;
}

module.exports = {
    compare
}