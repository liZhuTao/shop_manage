<template>
    <div class="login_container">
        <div class="Login_logo">
            <div class="Login_title">湖工e购管理系统</div>
        </div>
        <div class="login_box">
            <el-form 
            :model="loginForm" 
            :rules="loginFormRules" 
            ref="loginFormRef"
            label-width="0px" 
            class="login_form"
            >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input 
                    prefix-icon="el-icon-user-solid"
                    v-model="loginForm.username"
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input 
                    prefix-icon="el-icon-lock"
                    v-model="loginForm.password"
                    type="password"></el-input>
                </el-form-item>
                <!-- 按钮区 -->
                <el-form-item>
                    <el-button type="primary" class="login_button" @click="login">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button 
                    type="text" 
                    class="login_forget" 
                    @click="dialogVisible = true"
                    >忘记密码？</el-button>
                    <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose">
                    <span>默认登录名是admin，密码123456</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </span>
                    </el-dialog>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            //登录表单数据
            loginForm:{
                username:"admin",
                password:"123456"
            },
            dialogVisible: false,   //弹出框提示
            //表单验证规则对象
            loginFormRules:{
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
        },
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return;
                let { data:res } = await this.$http.post('login',this.loginForm);
                if(res.meta.status !== 200) return this.$massage.error('登录失败！');
                this.$message.success('登录成功');
                //存储登录的token值
                window.sessionStorage.setItem('token',res.data.token);
                //登录成功页面跳转
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
  background-image: url(../../assets/login.png);
  height: 100%;
  .Login_title {
    font-size: 40px;
    letter-spacing: 2px;
    font-weight: 700;
    color: #666;
    position: absolute;
    top: 5%;
    left: 4%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    position: absolute;
    top: 25%;
    right: 4%;
    box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
    .login_form{
        margin: 70px 20px;
        .login_button{
        position: relative;
        left: 10%;
        width: 80%;
        }
        .login_forget{
            float: right;
        }
    }
  }
}
</style>