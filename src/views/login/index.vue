<template>
    <div class="login">
        <el-form ref="form"
                 class="login-form"
                 :model="form"
                 :rules="rules"
                 :label-position="'top'"
                 label-width="80px">
            <div class="title">登陆</div>
            <el-form-item label="手机号"
                          prop="phone">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="密码"
                          prop="password">
                <el-input v-model="form.password"
                          type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           :loading="saving"
                           class="login-btn"
                           @click="onSubmit">登陆</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '../../services/user'
export default Vue.extend({
    name: 'Login',
    data () {
        return {
            form: {
                phone: '',
                password: ''
            },
            rules: {
                phone: [
                    {
                        pattern: /^1\d{10}$/, required: true, message: '请输入正确的手机号', trigger: ['blur', 'change']
                    }
                ],
                password: [
                    {
                        min: 6, max: 18, required: true, message: '密码长度在6到18个字符', trigger: ['blur', 'change']
                    }
                ]
            },
            saving: false
        }
    },
    methods: {
        onSubmit () {
            try {
                (this.$refs.form as Form).validate((valid: boolean) => {
                    if (!valid) {
                        return
                    }
                    this.saving = true
                    // axios默认发送的是 application/json格式，这里要用到是x-www-form-urlencoded
                    login(this.form).then((res: any) => {
                        const { data } = res
                        // 登陆失败直接提示
                        if (data.state !== 1) {
                            this.$message({
                                type: 'error',
                                message: data.message
                            })
                            this.saving = false
                            return
                        }
                        // 设置token
                        this.$store.commit('setUser', data.content)
                        this.$router.push(this.$route.query.redirect as string || '/')
                    })
                })
            } catch (error) {
                this.saving = false
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.login {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .title {
        font-size: 20px;
    }
    .login-form {
        background-color: #ffffff;
        padding: 20px;
        width: 300px;
        border-radius: 5px;
    }
    .login-btn {
        width: 100%;
    }
}
</style>