FROM --platform=linux/amd64 registry.cn-hangzhou.aliyuncs.com/browser/nginx:1.24-alpine
LABEL maintainer="Browser <browser_hot@163.com>"


# 将app加入到容器中
COPY dist  /www/dist

COPY openvpn-cms-vue.conf /etc/nginx/conf.d

RUN echo "https://mirrors.ustc.edu.cn/alpine/v3.17/main" > /etc/apk/repositories \
    && echo "https://mirrors.ustc.edu.cn/alpine/v3.17/community" >> /etc/apk/repositories \
    && apk add --no-cache busybox-extras
