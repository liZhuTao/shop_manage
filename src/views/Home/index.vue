<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div class="header_title">湖工e购管理系统</div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="collapse ? '64px': '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <myaside :collapse="collapse"></myaside>
            </el-aside>
            <!-- 右主体 -->
            <el-main>
                <!-- 路由占位 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Aside from './components/Aside'
    export default {
        data(){
            return {
                collapse:false
            }
        },
        components:{
            'myaside': Aside
        },
        methods:{
            //退出登录
            logout(){
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            //点击按钮切换菜单的折叠和展开
            toggleCollapse(){
                this.collapse = !this.collapse;
            }
        },
        
    }
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: #383E4A;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_title{
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: 700;
        color: rgb(233, 231, 231);
    }
}
.el-aside{
    background-color: #DEDEDE;
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #F7F7F7;
}

.toggle-button{
    background-color: #cfcfcf;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>