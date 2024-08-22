# openvpn-cms-vue

[后端系统传送门](https://github.com/xiaoyunjie/openvpn-cms-flask)

>基于Lin-cms-vue 二次开发的openvpn-cms-vue，是openvpn-cms的前端，后端是openvpn-cms-flask

VPN概览
![images](images/openvpn-1.png)

VPN列表
![images](images/openvpn-2.png)

VPN历史信息
![images](images/openvpn-3.png)


## 安装部署

### 手动编译
- Node.js（version：8.11.0+）
- npm (version: 5.6.0) 

克隆代码：`git clone https://github.com/xiaoyunjie/openvpn-cms-vue.git  openvpn-cms-vue`

安装npm：`yum install -y npm`

更新npm到5.6.0：`npm i -g n`

更新node后，版本没有发生变化，原因是环境变量没有设置
```bash
echo "export N_PREFIX=/usr/local" >> /etc/profile
echo "export PATH=\$N_PREFIX/bin:\$PATH" >> /etc/profile
source /etc/profile
mkdir -p /usr/local/n
# 切换node版本
sudo n 8.11.3
# 安装依赖
cd /opt/openvpn-cms-vue && npm install
# 测试运行 http://localhost:8000
npm run serve
# 编译
npm run build
```


### 发布
vue项目无需每次都 `npm run serve`，只需要打包成html页面，静态发布就行。

打包完成后，会在当前目录下生成一个dist目录，里面就是静态文件，将文件放到指定目录下，并用nginx代理。

或者直接从release中获取部署包进行部署。

```bash
yum install nginx -y    ## 安装nginx
mkdir -p /www           ## 创建发布目录
cp -r dist  /www/      ## 拷贝静态文件到发布目录
systemctl start nginx   ## 启动nginx
systemctl enable nginx  ## 开机启动nginx
```

nignx 配置
```bash
http {
    server {
        listen       8000;
    
        location / {
            alias /www/dist/;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }
        location ~^/(cms|v1) {
            proxy_pass http://127.0.0.1:5000;
        }
    
        error_page 404 /404.html;
            location = /40x.html {
        }
        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}
```

### docker 部署

```bash
docker run -d --rm --name=openvpn-cms-vue \
    -p 8000:8000 \
    -v ./service/nginx/logs:/var/log/nginx \
    -v ./openvpn-cms-vue.conf:/etc/nginx/conf.d/openvpn-cms-vue.conf \
    registry.cn-hangzhou.aliyuncs.com/browser/openvpn-cms-vue:v1.1.0
```

如果启动失败，请先把后端启动起来

> 如果此系统对你有所帮助，请Start一波！！
