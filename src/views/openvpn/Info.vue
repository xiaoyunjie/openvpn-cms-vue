<template>
    <div class="container">
        <div class="quantity-statistics">
            <div class="quantity-item">
                <div class="quantity-detail">
                    <div class="quantity-detail-box">
                        <div class="quantity-title">总访问量</div>
                        <div class="quantity-border-line"></div>
                        <div class="quantity">{{totalvisits}}</div>
                    </div>
                </div>
                <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>
            </div>
            <div class="quantity-item">
                <div class="quantity-detail">
                    <div class="quantity-detail-box">
                        <div class="quantity-title">总用户数</div>
                        <div class="quantity-border-line"></div>
                        <div class="quantity">{{totalusers}}</div>
                    </div>
                </div>
                <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>
            </div>
            <div class="quantity-item">
                <div class="quantity-detail">
                    <div class="quantity-detail-box">
                        <div class="quantity-title">当前连接用户</div>
                        <div class="quantity-border-line"></div>
                        <div class="quantity">{{connected.nclients}}</div>
                    </div>
                </div>
                <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>
            </div>
        </div>
        <div class="version-statistics">
            <div class="version-item">
                <div class="version-detail">
                    <div class="version-detail-box">
                        <div class="version">{{version.name}}</div>
                    </div>
                </div>
            </div>
            <div class="quantity-icon"><el-button size="large" type="primary"  @click="refresh">刷新</el-button></div>
        </div>
        <div class="content">
            <!-- 表格 -->
            <lin-table
                    :tableColumn="tableColumn"
                    :tableData="tableData"
                    v-loading="loading"
                    :border="border"
            ></lin-table>
        </div>
    </div>
</template>

<script>

import Vue from 'vue'
import OpenVPN from '@/models/openvpn'
import LinTable from '@/components/base/table/lin-table'


export default {
  components: {
    LinTable
  },
  inject: ['reload'],
  data() {
    return {
      tableColumn: [
        { prop: 'username', label: '用户名' },
        { prop: 'remote_ip', label: '公网IP', width: 150 },
        { prop: 'port', label: '源端口' },
        { prop: 'local_ip', label: '虚拟IP', width: 150 },
        { prop: 'bytes_sent', label: '发送字节', scope: 'bytes_sent', customRender(row, column) { return Vue.filter('filterbytesToSize')(column) } },
        { prop: 'bytes_recv', label: '接受字节', scope: 'bytes_recv', customRender(row, column) { return Vue.filter('filterbytesToSize')(column) } },
        { prop: 'connected_since', label: '在线时间', scope: 'connected_since', customRender(row, column) { return Vue.filter('filterTimeInterval')(column) }, width: 150 },
        { prop: 'location', label: '位置标识' },
        { prop: 'country', label: '国家' },
        { prop: 'longitude', label: '经度' },
        { prop: 'latitude', label: '纬度' },
        { prop: 'region', label: '地区' },
        { prop: 'city', label: '城市' },
      ],
      tableData: [],
      border: true, // 显示边框
      loading: false,
      totalvisits: '',
      totalusers: '',
      connected: {
        nclients: '',
      },
      version: {
        name: '',
      },
    }
  },
  // mounted() {
  //   if (document.body.clientWidth > 1200 && document.body.clientWidth < 1330) {
  //     this.showTeam = true
  //   }
  // },
  async created() {
    this.loading = true
    await this.get_clientslist()
    await this.get_totalvisits()
    await this.get_totalusers()
    await this.get_connected()
    await this.get_version()
    this.loading = false
  },
  methods: {
    refresh() {
      this.reload()
      // console.log('组件刷新了!!')
    },
    // version
    async get_version() {
      const res = await OpenVPN.get_version()
      this.version = res
    },
    // 在线用户
    async get_connected() {
      const res = await OpenVPN.get_connected()
      this.connected = res
    },
    // 总访问量
    async get_totalvisits() {
      const res = await OpenVPN.get_totalvisits()
      this.totalvisits = res
    },
    // 总用户数
    async get_totalusers() {
      const res = await OpenVPN.get_totalusers()
      this.totalusers = res
    },
    async get_clientslist() {
      try {
        const res = await OpenVPN.get_clientslist()
        this.tableData = [...res.items]
      } catch (error) {
        if (error.error_code === 10020) {
          this.tableData = []
        }
      }
    },
    // handleArticle(link) {
    //   window.open(link)
    // },
  },
}
</script>

<style scoped lang="scss">
    .container {
        padding: 10px 20px;
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            margin-bottom: -24px;

            .header-left {
                float: left;

                .title {
                    height: 59px;
                    line-height: 59px;
                    color: #4c76af;
                    font-size: 16px;
                    font-weight: 500;
                }
            }

            .header-right {
                float: right;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }

        .quantity-statistics {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            height: 90px;
            text-align: center;
            .quantity-item {
                display: flex;
                width: 30%;
                height: 100%;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 2px 14px 0px rgba(150, 152, 143, 1);
                border-radius: 8px;
                .quantity-detail {
                    flex: 1;
                    .quantity-detail-box {
                        margin: 12px 0 0 30px;
                        .quantity-title {
                            margin-bottom: 2px;
                            height: 20px;
                            line-height: 20px;
                            color: #010307;
                            font-size: 20px;
                            font-weight: 400;
                        }
                        .quantity-border-line {
                            margin:0 auto;
                            width: 120px;
                            height: 3px;
                            background: rgba(27, 31, 139, 1);
                        }
                        .quantity {
                            margin-top: 7px;
                            height: 48px;
                            font-size: 32px;
                            color: rgba(37, 188, 142, 1);
                            line-height: 38px;
                            letter-spacing: 2px;
                        }
                    }
                }
                .quantity-icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 90px;
                    height: 100%;
                    background: rgba(69, 119, 255, 0.1);
                    border-top-right-radius: 8px;
                    border-bottom-right-radius: 8px;
                    img {
                        width: 28px;
                        height: 33px;
                    }
                }
            }
        }

        .version-statistics {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            height: 50px;
            text-align: left;
            .version-item {
                display: flex;
                width: 90%;
                height: 100%;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 2px 14px 0px rgba(150, 152, 143, 1);
                border-radius: 8px;
                .version-detail {
                    /*display: inline;*/
                    flex: 1;
                    .version-detail-box {
                        /*display: inline;*/
                        margin: 20px 0 0 10px;
                        .version-title {
                            margin-bottom: 2px;
                            height: 20px;
                            line-height: 20px;
                            color: #010307;
                            font-size: 20px;
                            font-weight: 400;
                        }
                        .version {
                            /*display: inline;*/
                            margin-top: 16px;
                            height: 48px;
                            font-size: 14px;
                            color: rgba(45, 109, 165, 1);
                            /*line-height: 38px;*/
                            /*letter-spacing: 2px;*/
                        }
                    }
                }
            }
        }

        .content {
            padding: 10px 20px;

            article {
                position: relative;
                margin-bottom: -24px;

                section {
                    padding: 0 0 36px;
                    position: relative;

                    &:before {
                        content: '';
                        width: 1px;
                        top: 7px;
                        bottom: -17px;
                        left: 10.5px;
                        background: #f3f3f3;
                        position: absolute;
                    }

                    &:last-child:before {
                        display: none;
                    }

                    .point-time {
                        content: '';
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        top: 2px;
                        left: 10px;
                        background: $theme;
                        margin-left: -4px;
                        border-radius: 50%;
                    }

                    time {
                        width: 15%;
                        display: block;
                        position: absolute;

                        span {
                            display: block;
                            text-align: right;
                        }
                    }

                    aside {
                        color: #45526b;
                        margin-left: 30px;

                        .things {
                            font-size: 14px;
                            color: #45526b;
                            margin-bottom: 15px;
                        }
                    }

                    .text-yellow {
                        color: #8c98ae;
                        font-size: 14px;
                        line-height: 20px;
                        padding-right: 30px;
                        float: left;
                    }

                    .brief {
                        font-size: 14px;
                        color: #c4c9d2;
                        height: 20px;
                        line-height: 20px;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 1200px) {
        .container .lin-info .lin-info-right {
            display: none;
        }
        .container .lin-info .lin-info-left {
            width: 100%;
        }
        .container .quantity-statistics .quantity-item {
            width: 32%;
            &:last-child {
                display: none;
            }
        }
        .container .information .personal {
            display: none;
        }
    }

    @media screen and (max-width: 1200px) {
        .container .lin-info .lin-info-left {
            width: 100%;
        }
    }
</style>
