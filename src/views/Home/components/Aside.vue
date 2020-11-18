<template>
  <el-menu
    background-color="#DEDEDE"
    text-color="#000"
    active-text-color="#409Bff"
    unique-opened
    router
    :collapse="collapse"
    :collapse-transition="false"
    :default-active="activePath"
    >
    <!-- 一级菜单 -->
    <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
      <!-- 一级菜单模板 -->
      <template slot="title">
        <i :class="iconsObj[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <!-- 二级菜单 -->
      <el-menu-item 
        :index="'/' + subItem.path" 
        v-for="subItem in item.children" 
        :key="subItem.id"
        @click="saveNavState('/' + subItem.path)"
        >
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ subItem.authName }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
    props:['collapse'],
    data(){
        return {
            menulist:[],
            iconsObj:{
                '125':'el-icon-s-custom',
                '103':'el-icon-s-tools',
                '101':'el-icon-s-goods',
                '102':'el-icon-s-order',
                '145':'el-icon-data-line'
            },
            activePath:''
        }
    },
    created(){
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
        //获取菜单信息
        getMenuList(){
            this.$http.get('menus').then(res=>{
                let result = res.data
                console.log(result);
                if(result.meta.status !== 200) return this.$message.error(result.meta.msg)
                this.menulist = result.data
            })
        },
        //保存链接的激活状态
        saveNavState(activePath){
          window.sessionStorage.setItem('activePath',activePath)
          this.activePath = activePath;
        }
    }
};

</script>

<style lang="less" scoped>
</style>