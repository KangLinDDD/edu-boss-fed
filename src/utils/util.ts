const formatDate = (time: any, separator = '-', type = 'yyyy-MM-dd') => {
    if (!time && typeof (time) !== 'number') {
        return ''
    }
    // 后台返回的时间戳可能是字符串类型的可能是几个时间戳
    let ary = []
    const date = new Date(time)
    if (time instanceof Date) { } else {
        time = time && parseInt(time)
    }
    const year = date.getFullYear()
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const sec = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    let str1 = ''
    let str2 = ''
    switch (type) {
        case 'YY-MM':
            ary = [year, month]
            break
        case 'YY-MM-DD':
            ary = [year, month, day]
            break
        case 'hh-mm':
            ary = [hour, min]
            break
        case 'hh-mm-ss':
            ary = [hour, min, sec]
            break
        case 'MM-dd':
            ary = [month, day]
            break
        // 假勤单据只显示到分
        case 'Y-M-d-h-m-0':
            str1 = [year, month, day].join('-')
            str2 = [hour, min, '00'].join(':')
            ary = [str1, str2]
            break
        case 'Y-M-d-h-m-s':
            str1 = [year, month, day].join('-')
            str2 = [hour, min, sec].join(':')
            ary = [str1, str2]
            break
        // 配合导出表格的文件名。。。
        case 'y-m-d-h-m-s':
            str1 = [year, month, day].join('-')
            str2 = [hour, min, sec].join('-')
            ary = [str1, str2]
            break
        // 显示到分
        case 'y-m-d-h-m':
            str1 = [year, month, day].join('/')
            str2 = [hour, min].join(':')
            ary = [str1, str2]
            break
        // mm-dd hh:mm
        case 'm-d-h-m':
            str1 = [month, day].join('/')
            str2 = [hour, min].join(':')
            ary = [str1, str2]
            break
        default:
            ary = [year, month, day]
    }
    return ary.join(separator)
}
export {
    formatDate
}