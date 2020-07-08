const openvpnRouter = {
  route: null,
  name: null,
  title: 'VPN管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-shili',
  // icon: 'icons/icefrog.png',
  filePath: 'views/openvpn/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '新增用户',
      type: 'view',
      name: 'UserAdd',
      route: '/openvpn/add',
      filePath: 'views/openvpn/UserAdd.vue',
      inNav: true,
      icon: 'iconfont icon-shili',
      // icon: 'icons/icefrog.png',
      permission: ['创建openvpn用户'],
    },
    {
      title: 'VPN列表',
      type: 'view',
      name: 'UserList',
      route: '/openvpn/userlist',
      filePath: 'views/openvpn/UserList.vue',
      inNav: true,
      icon: 'iconfont icon-shili',
      // icon: 'icons/icefrog.png',
    },
    {
      title: '历史信息',
      type: 'view',
      name: 'HistoryInfo',
      route: '/openvpn/historylist',
      filePath: 'views/openvpn/HistoryInfo.vue',
      inNav: true,
      icon: 'iconfont icon-shili',
    },
  ],
}

export default openvpnRouter
