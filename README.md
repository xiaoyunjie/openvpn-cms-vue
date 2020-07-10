### openvpn-cms-vue

基于Lin-cms-vue 二次开发的openvpn-cms-vue

### 安装部署
- Node.js（version：8.11.0+）
- npm 

`git clone https://github.com/xiaoyunjie/openvpn-cms-vue.git`

`yum install npm`

`npm install -g n`

`n 8.11.3`

更新node后，版本没有发生变化，原因是环境变量没有设置

```bash
echo "export N_PREFIX=/usr/local/bin" >> ~/.bash_profile
echo "export PATH=$N_PREFIX/bin:$PATH" >> ~/.bash_profile
source ~/.bash_profile
```

#### 修改配置文件 index.js
```bash
vi src/config/stage/index.js
baseURL: 'http://localhost:5000'
```