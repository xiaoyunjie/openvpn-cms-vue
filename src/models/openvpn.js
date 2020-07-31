/* eslint-disable class-methods-use-this */
import { post, get } from '@/lin/plugins/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class OpenVPN {
  constructor(uPage = 0, uCount = 10, gPage = 0, gCount = 5) {
    this.uPage = uPage
    this.uCount = uCount
    this.lPage = gPage
    this.gCount = gCount
  }

  // 类中的方法可以代表一个用户行为
  // 创建用户
  async create_user(info) {
    const res = await post('v1/openvpn', info, { handleError: true })
    return res
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  // 查询单个用户
  // async get_user(id) {
  //   const res = await get(`v1/openvpn/${id}`)
  //   return res
  // }

  // 查询所有用户
  async get_users({ count = this.uCount, page = this.uPage }) {
    const res = await get('v1/openvpn', { count, page }, { handleError: true })
    return res
  }

  // 根据username注销用户
  async delete_openvpnuser(info) {
    const res = await post('v1/openvpn/deluser', { username: info }, { handleError: true })
    return res
  }

  // 搜索用户信息
  async searchuserinfo({ count = this.uCount, page = this.uPage, username, keyword, start, end }) {
    try {
      const res = await get('v1/openvpn/userinfosearch', { count, page, username, keyword, start, end }, { handleError: true })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  // 更新mac地址
  async update_mac(info) {
    try {
      const res = await post('v1/openvpn/update', { openvpn_user_info: info }, { showBackend: true })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  // 根据用户查询IP
  async get_user_ip(info) {
    try {
      const res = await post('v1/openvpn/searchip', { openvpn_user_info: info }, { showBackend: true })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  // 根据IP查询用户
  async get_ip_user(info) {
    try {
      const res = await post('v1/openvpn/searchuser', { openvpn_ip: info }, { showBackend: true })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  // 查询所有历史信息
  async get_info({ count = this.uCount, page = this.uPage }) {
    const res = await get('v1/openvpn/info', { count, page }, { handleError: true })
    return res
  }

  // arp绑定
  async arp() {
    const res = await post('v1/openvpn/arpbinding', { handleError: true })
    return res
  }

  // 下载证书
  // async download_cert(info) {
  //   const res = await apiDownloadFiles('v1/openvpn/download', { openvpn_user_info: info }, { showBackend: true })
  //   return res
  // }

  // 历史信息搜索
  async searchkeyworkinfo({ count = this.uCount, page = this.uPage, username, keyword, start, end }) {
    try {
      const res = await get('v1/openvpn/infosearch', { count, page, username, keyword, start, end }, { handleError: true })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  // 查询vpn版本
  async get_version() {
    const res = await get('v1/openvpn/openvpnversion', { handleError: true })
    return res
  }

  // 查询当前连接数客户端
  async get_connected() {
    const res = await get('v1/openvpn/clientsconnected', { handleError: true })
    return res
  }


  // 查询已连接客户端详细信息
  async get_clientslist() {
    const res = await get('v1/openvpn/clientslist', { handleError: true })
    return res
  }


  // 总访问量
  async get_totalvisits() {
    const res = await get('v1/openvpn/totalvisits', { handleError: true })
    return res
  }


  // 总用户数
  async get_totalusers() {
    const res = await get('v1/openvpn/totalusers', { handleError: true })
    return res
  }
}

// 下载本地固定文件
// export const exportFile = params => exportFileRequest('v1/openvpn/download', params)

export default new OpenVPN()
