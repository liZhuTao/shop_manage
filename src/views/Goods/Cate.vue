<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type='primary' @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table
            class="treeTable"
            :data="catelist"
            :columns="columns"
            border
            show-index
            index-text="#"
            :selection-type="false"
            :expand-type="false">
                <!-- 有效性 -->
                <template #isok="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
                <!-- 排序 -->
                <template #order="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template #opt="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
            
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：" >
                    <el-cascader
                        v-model="selectedKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChanged"
                        clearable
                        change-on-select></el-cascader>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改分类对话框 -->
        <el-dialog
            title="修改分类"
            :visible.sync="editCateDialogVisible"
            width="50%"
            @close="editCateDialogClosed">

            <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px" >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            queryInfo:{     //查询条件
                type:3,
                pagenum:1,
                pagesize:5
            },
            catelist:[],    //商品分类的数据列表，默认为空
            total:0,        // 总数据条数
            columns:[{      //table的列定义
                label:'分类名称',
                prop:'cat_name'
            },{
                label:'是否有效',
                type:'template',    //表示将当前列作为模板列
                template:'isok'
            },{
                label:'排序',
                type:'template',    //表示将当前列作为模板列
                template:'order'
            },{
                label:'操作',
                type:'template',    //表示将当前列作为模板列
                template:'opt'
            }],
            addCateDialogVisible:false, //控制添加分类框的显示和隐藏
            editCateDialogVisible:false,    //控制修改分类对话框的显示和隐藏
            addCateForm:{   //添加分类的表单数据对象
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },
            editCateForm:{
                cat_name:'',
                cat_id: 0,
                cat_pid: 0,
                cat_level: 0
            },
            //天界分类的验证规则对象
            addCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}
                ]
            },
            editCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}
                ]
            },
            //保存父级分类
            parentCateList:[],
            //指定级联选择器的配置对象
            cascaderProps:{
                expandTrigger: 'hover' ,
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //险种的父级id数组
            selectedKeys:[],
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        //获取商品分类数据
        async getCateList(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status !== 200){
                return this.$message.error('获取商品分类失败！');
            }
            this.catelist = res.data.result;    //获取数据列表
            this.total = res.data.total;        //为总数据条数赋值
        },
        //监听pagesize改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        //监听pagenum改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        //点击按钮显示添加分类对话框
        showAddCateDialog(){
            //先获取父级列表数据
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        //获取父级分类的请求列表
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200){
                return this.$message.error('获取父级分类失败！')
            }

            this.parentCateList = res.data
            console.log(this.parentCateList)
        },
        //选择项发生变化触发
        parentCateChanged(){
            console.log(this.selectedKeys)
            //length===0->一级，1->二级，2->三级
            if(this.selectedKeys.length>0){
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                this.addCateForm.cat_level = this.selectedKeys.length
                return 
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
            
        },
        //点击按钮添加新分类
        addCate(){
            this.$refs.addCateFormRef.validate(async valid=>{
                if(!valid) return ;
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201){
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        //监听添加分类弹窗的关闭事件
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level=0
            this.addCateForm.cat_pid=0
        },
        //展示修改分类对话框，并请求数据
        async showEditDialog(cate){
            let id = cate.cat_id
            const {data:res} = await this.$http.get('categories/' + id)
            if(res.meta.status !== 200){
                return this.$message.error('获取分类数据失败！')
            }
            this.editCateForm = res.data
            this.editCateDialogVisible = true;
        },
        //监听修改对话框关闭事件
        editCateDialogClosed(){
           this.editCateForm.cat_name=''
           this.editCateForm.cat_id=0
           this.editCateForm.cat_pid=0
           this.editCateForm.cat_level=0
        },
        //点击确定修改分类
        editCate(){
            this.$refs.editCateFormRef.validate(async valid=>{
                if(!valid) return ;
                const {data:res} = await this.$http.put(`categories/${this.editCateForm.cat_id}`,{cat_name:this.editCateForm.cat_name})
                if(res.meta.status !== 200){
                    return this.$message.error('修改分类失败！')
                }
                this.$message.success('修改分类成功！')
                console.log(this.catelist)
                this.getCateList()
                // this.currentCate.cat_name = res.data.cat_name
                this.editCateDialogVisible = false
            })
        },
        //点击删除
        async deleteCate(id){
            const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            if(confirmResult!=='confirm'){
                return this.$message.info('取消了删除！')
            }

            const {data:res} = await this.$http.delete(`categories/${id}`)

            if(res.meta.status !== 200){
                return this.$message.error("删除分类失败！")
            }
            this.$message.success("删除分类成功！")
            this.getCateList()

        }
    }
}
</script>

<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width:100%;      
}
</style>