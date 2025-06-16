all: build push

build:
	docker build --pull --platform linux/amd64 -t registry.cn-hangzhou.aliyuncs.com/browser/openvpn-cms-vue:v1.1.1 .

push:
	docker push registry.cn-hangzhou.aliyuncs.com/browser/openvpn-cms-vue:v1.1.1

.PHONY: all build push
