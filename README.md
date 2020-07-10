### openvpn-cms-vue

>基于Lin-cms-vue 二次开发的openvpn-cms-vue，是openvpn-cms的前端，后端是openvpn-cms-flask

VPN概览
![images](images/openvpn-1.png)

VPN列表
![images](images/openvpn-2.png)

VPN历史信息
![images](images/openvpn-3.png)


### 安装部署
- Node.js（version：8.11.0+）
- npm 

`git clone https://github.com/xiaoyunjie/openvpn-cms-vue.git`

`yum install -y npm`

`npm install -g n`

`n 8.11.3`

更新node后，版本没有发生变化，原因是环境变量没有设置

```bash
echo "export N_PREFIX=/usr/local/bin" >> /etc/profile
echo "export PATH=$N_PREFIX/bin:$PATH" >> /etc/profile
source /etc/profile
```

#### 修改配置文件 index.js
```bash 
vi src/config/stage/index.js
baseURL: 'http://localhost:5000'
```

#### 启动
`npm install`

`npm run serve`

http://localhost:8000