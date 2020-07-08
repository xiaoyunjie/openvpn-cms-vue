<template>
    <div class="container">
        <div class="title">新建用户</div>
        <div class="wrap">
            <el-row>
                <el-col :lg="16" :md="20" :sm="24" :xs="24">
                    <el-form
                     :model="form"
                     status-icon
                     ref="form"
                     :rules="rules"
                     v-loading="loading"
                     label-width="100px"
                     @submit.native.prevent
                    >
                        <el-form-item label="用户名" prop="username">
                            <el-input size="small" v-model="form.username" placeholder="请填写注册用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="nickname">
                            <el-input size="small" v-model="form.nickname" placeholder="请填用户真实姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="summary">
                            <el-input
                                    size="small"
                                    type="textarea"
                                    :autosize="{ minRows: 4, maxRows: 8 }"
                                    placeholder="请输入简介"
                                    v-model="form.summary"
                            >
                            </el-input>
                        </el-form-item>

                        <el-form-item  class="submit">
                            <el-button size="medium" type="primary" @click="submitForm('form')">创 建</el-button>
                            <el-button size="medium" @click="resetForm('form')">重 置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import OpenVPN from '@/models/openvpn'

export default {
  data() {
    // 验证回调函数
    const checkUserName = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        callback(new Error('用户名不能为空'))
      }
      callback()
    }
    const checkNickName = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        callback(new Error('姓名不能为空'))
      }
      callback()
    }
    return {
      loading: false, // 加载动画
      form: {
        username: '',
        nickname: '',
        summary: '',
      },
      // 验证规则
      rules: {
        username: [
          {
            validator: checkUserName,
            trigger: ['blur', 'change'],
            required: true,
          },
        ],
        nickname: [
          {
            validator: checkNickName,
            trigger: ['blur', 'change'],
            required: true,
          },
        ],
      },
    }
  },
  methods: {
    async submitForm(formName) {
      try {
        this.loading = true
        const res = await OpenVPN.create_user(this.form)
        if (res.error_code === 0) {
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.resetForm(formName)
        }
      } catch (error) {
        this.loading = false
        this.$message.error(error.data.msg)
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
    .title {
        height: 59px;
        line-height: 59px;
        color: $parent-title-color;
        font-size: 20px;
        font-weight: 500;
        text-indent: 45px;
        border-bottom: 1px solid #dae1ec;
    }

    .wrap {
        padding: 20px;
    }

    .submit {
        float: left;
    }
}
</style>
