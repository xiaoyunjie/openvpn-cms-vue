const Config = {
  // baseURL: 'http://localhost:5000',
  baseURL:'./',
  stagnateTime: 1 * 60 * 60 * 1000, // 无操作停滞时间  默认1小时
  openAutoJumpOut: true, // 是否开启无操作跳出
  notLoginRoute: ['login'], // 无需登录即可访问的路由 name,
  sideBarLevel: 3, // 侧边栏层级限制, 3表示三级, 可设置 2 和 3
  showSidebarSearch: true, // 默认打开侧边栏搜索
  defaultRoute: '/info', // 默认打开的路由
  // defaultRoute: '/openvpn/userlist',
}

export default Config
