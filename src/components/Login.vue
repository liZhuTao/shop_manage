<template>
    <div class="login_container">
        <div class="Login_logo">
            <div class="Login_title">湖工e购管理系统</div>
        </div>
        <div class="login_box">
            <el-form label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item>
                    <el-input 
                    prefix-icon="el-icon-user-solid"
                    v-model="form.name"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item>
                    <el-input 
                    prefix-icon="el-icon-lock"
                    v-model="form.pws"></el-input>
                </el-form-item>
                <!-- 按钮区 -->
                <el-form-item>
                    <el-button type="primary" class="login_button">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button 
                    type="text" 
                    class="login_forget" @click="dialogVisible = true">忘记密码？</el-button>
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
    data(){return {
        form:{
            name:"admin",
            pws:123456
        },
         dialogVisible: false
    }},
    methods:{
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
};
</script>

<style lang="less" scoped>
.login_container {
  background-image: url(../assets/login.png);
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