import Vue from 'vue'
import Utils from '../utils/util'
/*
 * 全局的过滤函数
 * */
function checkAddZone(num) {
  return num < 10 ? `0${num.toString()}` : num
}

const globalFilter = {
  filterAddress(value) {
    // 过滤地址
    if (!value) return value
    const obj = value
    return `${obj.provinceName}${obj.cityName}${obj.countyName} ${obj.detailInfo}`
  },

  filterTime(value) {
    // 过滤时间戳，返回值yyyy-mm-dd
    if (!value) {
      return value
    }
    const date = new Date(value * 1000)
    const y = 1900 + date.getYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    return val
  },

  filterTimeYmdHms(value) {
    // 过滤时间戳，返回值yyyy-mm-dd ss
    if (!value) {
      return value
    }
    // 毫秒转成正常日期，不需要乘1000
    const date = new Date(value)
    const y = 1900 + date.getYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    const hh = date.getHours()
    const mm = `${date.getMinutes()}`
    const ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}  ${hh}:${mm}:${ss}`
    return val
  },

  filterTimeYear(value) {
    // 过滤时间戳, 返回值 今年:mm-dd 往年:yyyy-mm-dd
    const jy = 1900 + new Date().getYear()
    const date = new Date(value * 1000)
    const y = 1900 + date.getYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    const thisYear = `${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    if (jy === y) {
      return thisYear
    }
    return val
  },

  dateFormatter(nows) {
    if (!nows) return ''
    const now = new Date(nows)
    const year = now.getFullYear()

    let month = now.getMonth() + 1
    month = checkAddZone(month)

    let date = now.getDate()
    date = checkAddZone(date)
    return `${year}-${month}-${date}`
  },

  dateTimeFormatter(t) {
    if (!t) return ''
    t = new Date(t).getTime() // eslint-disable-line
    t = new Date(t) // eslint-disable-line
    const year = t.getFullYear()
    let month = t.getMonth() + 1
    month = checkAddZone(month)

    let date = t.getDate()
    date = checkAddZone(date)

    let hour = t.getHours()
    hour = checkAddZone(hour)

    let min = t.getMinutes()
    min = checkAddZone(min)

    let se = t.getSeconds()
    se = checkAddZone(se)

    return `${year}-${month}-${date} ${hour}:${min}:${se}`
  },

  // UTC标准时间
  dateTimeUTCFormatter(t) {
    if (!t) return ''
    t = new Date(t).getTime() // eslint-disable-line
    t = new Date(t) // eslint-disable-line
    const year = t.getUTCFullYear()
    let month = t.getUTCMonth() + 1
    month = checkAddZone(month)

    let date = t.getUTCDate()
    date = checkAddZone(date)

    let hour = t.getUTCHours()
    hour = checkAddZone(hour)

    let min = t.getUTCMinutes()
    min = checkAddZone(min)

    let se = t.getUTCSeconds()
    se = checkAddZone(se)

    return `${year}-${month}-${date} ${hour}:${min}:${se}`
  },

  filterTitle(value, len = 9) {
    return Utils.cutString(value, len)
  },

  // 时间差
  filterTimeInterval(value) {
    if (!value) {
      return value
    }
    const etime = new Date().getTime()
    const stime = new Date(value).getTime()
    // 两个时间戳相差的毫秒数
    const usedTime = etime - stime
    // 计算相差的天数
    const days = Math.floor(usedTime / (24 * 3600 * 1000))
    // 计算天数后剩余的毫秒数
    const leave1 = usedTime % (24 * 3600 * 1000)
    // 计算出小时数
    const hours = Math.floor(leave1 / (3600 * 1000))
    // 计算小时数后剩余的毫秒数
    const leave2 = leave1 % (3600 * 1000)
    // 计算相差分钟数
    const minutes = Math.floor(leave2 / (60 * 1000))
    const intervaltime = `${days}天${hours}时${minutes}分`
    return intervaltime
  },

  // 字节单位换算
  filterbytesToSize(value) {
    if (!value) {
      return value
    }
    if (value === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(value) / Math.log(k))
    // eslint-disable-next-line no-restricted-properties
    return `${(value / Math.pow(k, i)).toPrecision(3)}${sizes[i]}`
    // return parseFloat(bytes / Math.pow(k, i)).toFixed(2)  + sizes[i];
  }
}

// 全局过滤器
Object.keys(globalFilter).forEach(k => Vue.filter(k, globalFilter[k]))

export default globalFilter
