<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="roleDialogVisible=true;">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套二级权限 -->
                                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色的对话框 -->
        <el-dialog
        title="添加角色"
        :visible.sync="roleDialogVisible"
        width="50%"
        @close="roleDialogClosed">
        <!-- 内容主体区 -->
        <el-form 
            :model="roleForm" 
            :rules="roleFormRules" 
            ref="roleFormRef"
            label-width="70px" 
            >
                <!-- 用户名 -->
                <el-form-item 
                label="角色名"
                prop="roleName">
                    <el-input 
                    v-model="roleForm.roleName"
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item 
                label="描述"
                prop="roleDesc">
                    <el-input 
                    v-model="roleForm.roleDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="roleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRolesInfo">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 编辑角色的对话框 -->
        <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        <!-- 内容主体区 -->
        <el-form 
            :model="editForm" 
            :rules="editFormRules" 
            ref="editFormRef"
            label-width="70px" 
            >
                <!-- 用户名 -->
                <el-form-item 
                label="角色名"
                prop="roleName">
                    <el-input 
                    v-model="editForm.roleName"
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item 
                label="描述"
                prop="roleDesc">
                    <el-input 
                    v-model="editForm.roleDesc"
                    ></el-input>
                </el-form-item>
            </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRolesInfo">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 设置权限的对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClosed">
            <!-- 树形控件 -->
            <el-tree
                :data="rightlist"
                :props="treeProps"
                node-key="id"
                default-expand-all
                :default-checked-keys="defKeys"
                show-checkbox
                ref="treeRef">
            </el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return {
            rolelist:[],
            rightlist:[],   //获取所有权限的数据
            treeProps:{   //树形控件的属性绑定对象
                label:'authName',
                children:'children'
            },
            roleDialogVisible: false,
            editDialogVisible:false,
            setRightDialogVisible:false,
            roleForm:{ //添加用户的表单数据
                roleName:'',
                roleDesc:''
            },
            editForm:{},
            roleFormRules:{  //添加表单的验证规则
                roleName:[
                    {required:true,message:'请输入角色名',trigger:'blur'},
                    {min:3,max:10,message:'用户名的长度在3~10个字符之间',trigger:'blur'}
                ],
                roleDesc:[
                    {required:false,message:'请输入角色描述',trigger:'blur'}
                ]
            },
             editFormRules:{  //添加表单的验证规则
                roleName:[
                    {required:true,message:'请输入角色名',trigger:'blur'},
                    {min:3,max:10,message:'用户名的长度在3~10个字符之间',trigger:'blur'}
                ]
            },
            defKeys:[],  //默认选中的节点id值数组
            roleId:''

        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        //获取用户列表
        async getRolesList(){
            const {data:res} = await this.$http.get('roles');
            if(res.meta.status !== 200){
                return this.$message.error('获取用户列表失败！')
            }
            this.rolelist = res.data;
        },
        //点击确认发送添加用户请求
        async addRolesInfo(){
            this.$refs.roleFormRef.validate(async valid=>{
                if(!valid) return ;
                const {data:res} = await this.$http.post('roles',this.roleForm)
                // console.log(res)
                if(res.meta.status !== 201){
                    return  this.$message.error('添加角色失败！')
                }
                this.$message.success('添加角色成功！');
                    //重新获取角色列表数据
                    this.getRolesList()
                this.roleDialogVisible = false;
            })
        },
        //监听添加角色的对话框的关闭事件
        roleDialogClosed(){
            this.$refs.roleFormRef.resetFields()
        },
        async deleteUser(id){
            const {data:res} = await this.$http.delete('roles' + id)
        },
        async editUser(id){
           
            const {data:res} = await this.$http.get("roles/"+id);
            if(res.meta.status !== 200){
                return this.$message.error('查询用户数据失败！')
            }
            this.editForm = res.data
            this.editDialogVisible = true;
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        async editRolesInfo(){
            const {data:res} = await this.$http.put("roles/" + this.editForm.roleId,this.editForm);
            if(res.meta.status !== 200){
                return this.$message.error("编辑角色信息失败！")
            }

            this.$message.success("编辑角色信息成功！");
            this.editDialogVisible = false;
            this.getRolesList();
        },
        //根据用户id删除角色
        deleteUser(id){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async result=>{
                const {data:res} = await this.$http.delete('roles/'+id);
                console.log(res);
                if(res.meta.status !== 200){
                    return this.$message.error('删除用户失败！')
                }
                this.$message.success('删除用户成功');
                this.getRolesList();
            }).catch(err=>{
                console.log(err)
                if(err === cancel){
                    return this.$message.info('已取消删除')
                }
                console.log(err)
            })
        },
        //根据id删除对应的权限
        async removeRightById(role,rightId){
            //弹框提示用户是否要删除
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            if(confirmResult!=='confirm'){
                return this.$message.info('取消了删除！')
            }

            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

            if(res.meta.status !== 200){
                return this.$message.error("删除权限失败！")
            }

            //this.getRolesList()
            role.children = res.data
        },
        //展示分配权限的对话框
        async showSetRightDialog(role){
            this.roleId = role.id
            //获取所有权限的数据
            const {data:res} = await this.$http.get('rights/tree')

            if(res.meta.status !== 200){
                return this.$message.error('获取权限失败！')
            }
            //将获取的权限数据保存在data中
            this.rightlist = res.data;
            console.log(this.rolelist)
            //递归获取三级节点id
            this.getLesfKeys(role,this.defKeys)
            this.setRightDialogVisible = true;
        },
        //递归获取三级权限id
        getLesfKeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }

            node.children.forEach(item=>{
                this.getLesfKeys(item,arr)
            })
        },
        //监听分配权限的关闭时间
        setRightDialogClosed(){
            this.defKeys = []
        },
        // 点击确定分配权限
        async allotRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ];

            const idStr = keys.join(',')
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
            if(res.meta.status !== 200){
                return this.$message.error('分配权限失败！')
            }
            this.$message.success('分配权限成功！')
            this.getRolesList()
            this.setRightDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top:1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display:flex;
    align-items: center;
}
</style>