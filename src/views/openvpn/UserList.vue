<template>
    <div>
        <!-- 列表页面 -->
        <div class="container">
            <sticky-top>
                <div class="header">
                    <!-- 标题 -->
                    <div class="header-left"><p class="title">VPN列表</p></div>
                    <!-- 搜索 -->
                    <div class="header-right">
                        <lin-search @query="onQueryChangeUser" ref="searchUser" placeholder="请输入用户名" />
                        <lin-search @query="onQueryChange" ref="searchKeyword" placeholder="请输入姓名" />
                        <lin-date-picker @dateChange="handleDateChange" ref="searchDate" class="date"> </lin-date-picker>
                    </div>
                    <div class="header-right">
                        <el-button size="large" type="primary"   @click="refresh">刷新</el-button>
                    </div>
                </div>
                <el-divider v-if="!keyword"></el-divider>
            </sticky-top>
            <div class="wrap">
                <el-row type="flex" justify="space-around">
                    <el-col :lg="16" :md="20" :sm="24" :xs="24">
                        <el-form
                                :model="form"
                                status-icon
                                ref="form"
                                v-loading="loading"
                                @submit.native.prevent
                                :inline="true"
                        >
                            <el-form-item label="VPN_IP" prop="vpn_ip">
                                <el-input size="small" v-model="form.vpn_ip" placeholder="请填写VPN虚拟地址"></el-input>
                            </el-form-item>
                            <el-form-item  class="submit">
                                <el-button size="small" type="primary" @click="submitForm('form')">查 询</el-button>
                            </el-form-item>
                            <div class="right-items" style="float: right;">
                                <el-button size="large" type="primary" @click="submitarp()">手动arp绑定</el-button>
                            </div>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <transition name="fade">
                <div class="search" v-if="keyword">
                    <p class="search-tip">
                        搜索“<span class="search-keyword">{{ keyword }}</span
                    >”， 找到 <span class="search-num">{{ totalCount }}</span> 条日志信息
                    </p>
                    <button class="search-back" @click="backInit">返回全部信息</button>
                </div>
            </transition>
            <div class="content">
                <!-- 表格 -->
                <lin-table
                        :tableColumn="tableColumn"
                        :tableData="tableData"
                        :operate="operate"
                        @handleDelete="handleDelete"
                        @handleupdate="handleupdate"
                        @handlesearchip="handlesearchip"
                        @certdownload="certdownload"
                        v-loading="loading"
                        :border="border"
                ></lin-table>
                <!-- 分页 -->
                <div class="pagination">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :background="true"
                        :page-size="pageCount"
                        :current-page="currentPage"
                        v-if="refreshPagination"
                        layout="total, prev, pager, next, jumper"
                        :total="total_nums"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


import Vue from 'vue'
import OpenVPN from '@/models/openvpn'
import LinTable from '@/components/base/table/lin-table'
import LinSearch from '@/components/base/search/lin-search'
import LinDatePicker from '@/components/base/date-picker/lin-date-picker'
import Config from '@/config'

export default {
  components: {
    LinTable,
    LinSearch,
    LinDatePicker,
  },
  inject: ['reload'],
  data() {
    return {
      tableColumn: [
        { prop: 'username', label: '用户名', width: 300 },
        { prop: 'nickname', label: '姓名', width: 300 },
        { prop: 'create_time', label: '创建时间', scope: 'create_time', customRender(row, column) { return Vue.filter('filterTimeYmdHms')(column) }, width: 300 },
        { prop: 'summary', label: '简介', width: 300 }
      ],
      // 分页相关
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      total_nums: 0, // 分组内的用户总数
      tableData: [],
      operate: [],
      border: true, // 显示边框
      searchKeyword: '',
      searchUser: '',
      searchDate: [],
      loading: false,
      keyword: null,
      isSearch: false,
      finished: false,
      totalCount: 0,
      form: {
        vpn_ip: '',
      },
    }
  },
  // 调用
  async created() {
    this.loading = true
    await this.Get_Users()
    this.operate = [
      { name: 'IP查询', func: 'handlesearchip', type: 'primary' },
      { name: 'MAC更新', func: 'handleupdate', type: 'primary' },
      { name: '证书下载', func: 'certdownload', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger', auth: '删除用户' },
    ]
    this.loading = false
  },
  watch: {
    // 用户搜索
    searchUser(user) {
      if (user) {
        this.keyword = user
        if (this.searchKeyword) {
          this.keyword = `${user} ${this.searchKeyword}`
        }
        if (this.searchDate.length) {
          this.keyword = `${user} ${this.searchKeyword} ${this.searchDate}`
        }
      } else {
        this.keyword = ''
        if (this.searchKeyword) {
          this.keyword = `${this.searchKeyword}`
        }
        if (this.searchDate.length) {
          this.keyword = `${this.searchKeyword} ${this.searchDate}`
        }
        this.$refs.searchUser.clear()
      }
      this.searchPage()
    },
    // 关键字搜索
    searchKeyword(newVal) {
      if (newVal) {
        this.keyword = newVal
        if (this.searchUser) {
          this.keyword = `${this.searchUser} ${newVal}`
        }
        if (this.searchDate.length) {
          this.keyword = `${this.searchUser} ${newVal} ${this.searchDate}`
        }
      } else {
        this.keyword = ''
        if (this.searchUser) {
          this.keyword = `${this.searchUser}`
        }
        if (this.searchDate.length) {
          this.keyword = `${this.searchUser} ${this.searchDate}`
        }
        this.$refs.searchKeyword.clear()
      }
      this.searchPage()
    },
    // 日期搜索
    searchDate(newDate) {
      if (newDate && newDate.length) {
        this.keyword = `${newDate[0]}至${newDate[1]}`
        if (this.searchUser) {
          this.keyword = `${this.searchUser} ${newDate[0]}至${newDate[1]}`
        }
        if (this.searchKeyword) {
          this.keyword = `${this.searchUser} ${this.searchKeyword} ${newDate[0]}至${newDate[1]}`
        }
      } else {
        this.keyword = ''
        this.isSearch = false
        if (this.searchUser) {
          this.keyword = `${this.searchUser}`
        }
        if (this.searchKeyword) {
          this.keyword = `${this.searchUser} ${this.searchKeyword}`
        }
        this.$refs.searchDate.clear()
      }
      this.searchPage()
    },
  },
  // 方法
  methods: {
    refresh() {
      this.reload()
      // console.log('组件刷新了!!')
    },
    // 根据IP查询user
    async submitForm() {
      const res = await OpenVPN.get_ip_user(this.form.vpn_ip)
      if (res.error_code === 0) {
        this.$message({
          type: 'success',
          message: `${res.msg}`
        })
      }
    },
    // 绑定arp
    async submitarp() {
      const res = await OpenVPN.arp()
      if (res.error_code === 0) {
        this.$message({
          type: 'success',
          message: `${res.msg}`
        })
      }
    },
    // 获取用户数据
    async Get_Users() {
      let res
      const currentPage = this.currentPage - 1
      try {
        res = await OpenVPN.get_users({ count: this.pageCount, page: currentPage })
        this.tableData = [...res.items]
        this.total_nums = res.total
      } catch (e) {
        console.log(e)
      }
    },
    // 删除用户
    async handleDelete(val) {
      // console.log('val', val.row.username)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await OpenVPN.delete_openvpnuser(val.row.username)
        if (res.error_code === 0) {
          this.Get_Users()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        }
      })
    },
    // 更新mac地址
    async handleupdate(val) {
      // console.log('val', val.row.username)
      const res = await OpenVPN.update_mac(val.row.username)
      if (res.error_code === 0) {
        this.$message({
          type: 'success',
          message: `${res.msg}`
        })
      }
    },
    // 查询虚拟IP
    async handlesearchip(val) {
      // console.log('val', val.row.username)
      const res = await OpenVPN.get_user_ip(val.row.username)
      if (res.error_code === 0) {
        this.$message({
          type: 'success',
          message: `${res.msg}`
        })
      }
    },
    // 证书下载
    async certdownload(val) {
      console.log('val', val.row.username)
      const link = document.createElement('a')
      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', false, false)
      // link.href = 'http://192.168.149.9:5000/v1/openvpn/download?openvpn_user_info=openvpn'
      link.href = `${Config.baseURL}/v1/openvpn/download?openvpn_user_info=${val.row.username}`
      link.download = val.row.username
      link.target = '_blank'
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    // 切换分页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      await this.Get_Users('changePage')
      this.loading = false
    },
    // 条件检索
    async searchPage() {
      let res
      this.totalCount = 0
      // this.logs = []
      try {
        this.loading = true
        this.finished = false
        // const username = this.searchUser === '全部人员' ? '' : this.searchUser
        const username = this.searchUser
        res = await OpenVPN.searchuserinfo({
          // page: 0, // 初始化
          keyword: this.searchKeyword,
          username,
          start: this.searchDate[0],
          end: this.searchDate[1],
        })
        this.tableData = [...res.items]
        this.total_nums = res.total
        this.totalCount = res.total
      } catch (e) {
        this.loading = false
        console.log(e)
      }
      this.finished = true
      this.isSearch = true
      this.loading = false
    },
    // 搜索
    onQueryChange(query) {
      // 处理带空格的情况
      this.searchKeyword = query.trim()
    },
    onQueryChangeUser(query) {
      // 处理带空格的情况
      this.searchUser = query.trim()
    },
    // 日期
    handleDateChange(date) {
      this.searchDate = date
    },
    // 清空检索
    async backInit() {
      this.searchUser = ''
      this.searchKeyword = ''
      this.searchDate = []
      this.keyword = ''
      // this.tableData = []
      this.isSearch = false
      this.loading = true
      await this.Get_Users()
      this.loading = false
    },
  },
}

</script>

<style lang="scss" scoped>
    .container /deep/ .el-button {
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .container {
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

        .search {
            height: 52px;
            width: 100%;
            background: rgba(57, 99, 188, 0.1);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-top: 24px;

            .search-tip {
                margin-left: 40px;
                height: 52px;
                line-height: 52px;
                color: #354058;
                font-size: 14px;

                .search-keyword {
                    color: $theme;
                }

                .search-num {
                    color: #f4516c;
                }
            }

            .search-back {
                margin: 8px 20px;
                height: 32px;
                background: #f4516c;
                border: none;
                border-radius: 2px;
                color: #fff;
                padding: 0 13px;
                font-size: 14px;
                cursor: pointer;
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

        .more {
            height: 40px;
            line-height: 40px;
            color: $theme;
            font-size: 14px;
            margin-left: 28px;
            cursor: pointer;
            &.nothing {
                cursor: text;
            }

            .icon-gengduo {
                display: inline;
                margin-left: 6px;
            }

            .icon-loading {
                &:before {
                    display: inline-block;
                    animation: spin 1s linear infinite;
                }
            }
        }

        .pagination {
            display: flex;
            justify-content: flex-end;
            margin: 20px;
        }

    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    @media screen and (max-width: 1000px) {
        .date {
            display: none;
        }
    }
</style>
