<template>
  <div>
    <!-- <div>初始页</div> -->
    <div class='search-term'>
      <a-button class='right' @click='showCreateUserModal'>创建用户</a-button>
    </div>
    <a-table :columns='columns' :data-source='data' :pagination='false'>
      <a slot='name' slot-scope='text'>{{ text }}</a>
      <span slot='action' slot-scope='record'>
        <a-button type='link' @click='showUpdateUserModal(record)'>修改</a-button>
        <a-divider type='vertical' />
        <a-button type='link' @click='deleteUser(record.id)'>删除</a-button>
      </span>
    </a-table>
    <a-pagination
      style='margin-top: 20px;float: right'
      :default-current='page_num'
      :total='total'
      @change='handlePageChange' />
    <a-modal v-model:visible='createUserModal' :title="type==='create'?'创建用户':'修改用户'" width='40%'>
      <template #footer>
        <a-button key='back' @click='closeModal'>取消</a-button>
        <a-button key='submit' type='primary' :loading='confirmLoading' @click='submitForm'>提交</a-button>
      </template>
      <a-form :form='form' :label-col='{ span:5 }' :wrapper-col='{ span: 16 }' @submit='submitForm'>
        <a-form-item v-if='type==="update"' label='id' :show='false'>
          <a-input v-decorator="['id']" :disabled='true'></a-input>
        </a-form-item>
        <a-form-item
          label='用户名'>
          <a-input
            v-decorator="['login_name',{ rules: [{ required: true, message: '请输入用户名，用于登录' }] }]"
            placeholder='请输入用户名，用于登录'
            :disabled='type==="update"'
          />
        </a-form-item>
        <a-form-item label='姓名' required>
          <a-input
            v-decorator="['name',{ rules: [{ required: true, message: '请输入姓名' }] }]"
            placeholder='请输入姓名'
          />
        </a-form-item>
        <!--        <a-form-item label='角色'>-->
        <!--          <a-input v-model='form.role_type' :disabled='true'></a-input>-->
        <!--        </a-form-item>-->
        <div v-if='type==="create"'>
          <a-form-item label='密码' required>
            <a-input
              type='password'
              v-decorator="['password',{ rules: [{ required: true, message: '请输入密码' }] }]"
              placeholder='请输入密码'
            ></a-input>
          </a-form-item>
          <a-form-item label='确认密码' required>
            <a-input
              type='password'
              v-decorator="[
              'confirm_password',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入二次确认密码!',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              },
            ]"
              placeholder='请输入二次确认密码'
            ></a-input>
          </a-form-item>
        </div>
        <div v-else>
          <a-form-item v-if='!isChangePassword' label='密码'>
            <span>*********</span>
            <a-button type='link' @click='()=>{isChangePassword=true}'>修改</a-button>
          </a-form-item>
          <a-form-item v-if='isChangePassword' label='密码' required>
            <a-input type='password'
                     v-decorator="['password',{ rules: [{ required: true, message: '请输入密码' }] }]"
            ></a-input>
          </a-form-item>
          <a-form-item v-if='isChangePassword' label='确认密码' required>
            <a-input type='password'
                     v-decorator="[
              'confirm_password',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入二次确认密码!',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              },
            ]"
            ></a-input>
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { reqUserList, userDelete, userUpdate, userAdd } from '@/api/user'
import md5 from 'md5'
import { notification } from 'ant-design-vue'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    show: false
  },
  {
    title: '用户名',
    key: 'login_name',
    dataIndex: 'login_name'
  },
  {
    title: '姓名',
    key: 'name',
    dataIndex: 'name'
  },
  // {
  //   title: '角色',
  //   key: 'role_type',
  //   dataIndex: 'role_type'
  // },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'Dashboard',
  data() {
    return {
      data: null,
      columns,
      page_num: 1,
      page_size: 10,
      total: 0,
      // 创建、修改
      createUserModal: false,
      confirmLoading: false,
      type: '',
      isChangePassword: false,
      form: this.$form.createForm(this, {
        id: null,
        login_name: null,
        name: null,
        role_type: '普通用户',
        password: null,
        confirm_password: null
      })
    }
  },
  methods: {
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次密码不同，请重新输入!')
      } else {
        callback()
      }
    },
    async handlePageChange(page_num, page_size) {
      let res = await reqUserList({ page_num: page_num, page_size: page_size })
      this.data = res.result.users
      this.total = res.result.count
    },
    closeModal() {
      this.createUserModal = false
      this.isChangePassword = false
      this.form = this.$form.createForm(this, {
        id: null,
        login_name: null,
        name: null,
        role_type: '普通用户',
        password: null,
        confirm_password: null
      })
    },
    showCreateUserModal() {
      this.createUserModal = true
      this.type = 'create'
      this.form = this.$form.createForm(this, {
        id: null,
        login_name: null,
        name: null,
        role_type: '普通用户',
        password: null,
        confirm_password: null
      })
    },
    showUpdateUserModal(record) {
      this.createUserModal = true
      this.type = 'update'
      this.isChangePassword = false
      this.form = this.$form.createForm(this, {
        props: {
          id: Number,
          login_name: record.login_name,
          name: record.name,
          role_type: '普通用户',
          password: null,
          confirm_password: null
        }
      })
      const that = this
      this.$nextTick(() => {
        that.form.setFieldsValue({
          id: record.id,
          login_name: record.login_name,
          name: record.name
        })
      })
    },
    async getTableData() {
      let res = await reqUserList({ page_num: 1, page_size: 10 })
      this.data = res.result.users
      this.total = res.result.count
      this.page_num = res.result.page_num
      this.page_size = res.result.page_size
    },
    submitForm() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log(values)
          let res
          let success
          let error
          if (values.password) {
            values.password = md5(values.password)
          }
          if (this.type === 'create') {
            res = await userAdd(values)
            success = '创建成功'
            error = '创建失败'
          } else {
            res = await userUpdate(values)
            success = '更新成功'
            error = '更新失败'
          }
          if (res.code === 200) {
            notification['success']({
              message: success
            })
            this.getTableData()
            this.closeModal()
          } else {
            notification['error']({
              message: error
            })
          }
        }
      })
    },
    deleteUser(id) {
      const that = this
      this.$confirm({
        title: '确定要删除该用户吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          let res = await userDelete({ id: id })
          if (res.code === 200) {
            that.$notification.open({
              message: '删除成功',
              duration: 1
            })
            // this.getTableData()
            // this.closeDialog()
            let res = await reqUserList({ page_num: 1, page_size: 10 })
            that.data = res.result.users
            that.total = res.result.count
            that.page_num = res.result.page_num
            that.page_size = res.result.page_size
          }
        },
        onCancel() {
          console.log('Cancel')
        }
      })

    }
  },
  async created() {
    let res = await reqUserList({ page_num: 1, page_size: 10 })
    this.data = res.result.users
    this.total = res.result.count
    this.page_num = res.result.page_num
    this.page_size = res.result.page_size
  }
}
</script>

<style scoped>
</style>