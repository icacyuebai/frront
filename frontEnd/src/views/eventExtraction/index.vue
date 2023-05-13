<template>
  <div>
    <div class='search-term'>
      <a-select
        ref="select"
        v-model:value="type"
        placeholder="事故类型"
        :allowClear='true'
        style="width: 120px;margin-right: 20px"
      >
        <a-select-option value="中毒窒息">中毒窒息</a-select-option>
        <a-select-option value="压力容器">压力容器</a-select-option>
        <a-select-option value="坍塌事故">坍塌事故</a-select-option>
        <a-select-option value="机械伤害">机械伤害</a-select-option>
        <a-select-option value="淹溺事故">淹溺事故</a-select-option>
        <a-select-option value="火灾事故">火灾事故</a-select-option>
        <a-select-option value="灼烫事故">灼烫事故</a-select-option>
        <a-select-option value="爆炸事故">爆炸事故</a-select-option>
        <a-select-option value="物体打击">物体打击</a-select-option>
        <a-select-option value="矿山事故">矿山事故</a-select-option>
        <a-select-option value="空难事故">空难事故</a-select-option>
        <a-select-option value="起重事故">起重事故</a-select-option>
        <a-select-option value="起重伤害">起重伤害</a-select-option>
        <a-select-option value="车辆伤害">车辆伤害</a-select-option>
        <a-select-option value="锅炉事故">锅炉事故</a-select-option>
        <a-select-option value="高处坠落">高处坠落</a-select-option>
      </a-select>
      <a-button @click='getTableData'>查询</a-button>
      <a-button v-if='roleType==="admin"' class='right' @click='showUploadModal'>上传</a-button>
    </div>
    <a-table :columns='columns' :data-source='data' :pagination='false'>
      <a slot='name' slot-scope='text'>{{ text }}</a>
      <span slot='action' slot-scope='text, record'>
        <a-button @click="updateEventExtraction(record)" type='link'>修改</a-button>
        <a-divider type="vertical" />
        <a-button v-if='roleType==="admin"' @click='deleteEventExtr(record.id)' type='link'>删除</a-button>
      </span>
    </a-table>
    <a-pagination
      style='margin-top: 20px;float: right'
      :default-current="page_num"
      :total="total"
      @change="handlePageChange" />

    <a-modal
      title="上传事件文件"
      v-model:visible="uploadModalVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <a-upload
        v-model:file-list="fileList"
        name="file"
        :multiple="false"
        action="/api/eventCount/upload"
        @change="handleChange"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          上传文件
        </a-button>
      </a-upload>
    </a-modal>

    <a-modal v-model:visible="updateModalVisible" title="修改事件" width='50%'>
      <template #footer>
        <a-button key="back" @click="closeModal">取消</a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="submitForm">提交</a-button>
      </template>
      <a-form :model="form">
        <a-form-item label="事故名称">
          <a-input v-model="form.event_name" :disabled='true'/>
        </a-form-item>
        <a-form-item label="事件类别">
          <a-input v-model='form.type'></a-input>
        </a-form-item>
        <a-form-item label="事件类型">
          <a-input v-model='form.type_detail'></a-input>
        </a-form-item>
        <a-form-item label='时间'>
          <a-input v-model='form.date'></a-input>
        </a-form-item>
        <a-form-item label="地点">
          <a-input v-model='form.position'></a-input>
        </a-form-item>
        <a-form-item label="机构">
          <a-input v-model='form.company'></a-input>
        </a-form-item>
        <a-form-item label="伤亡人数">
          <a-input v-model='form.loss_people'></a-input>
        </a-form-item>
        <a-form-item label="经济损失">
          <a-input v-model='form.loss_economic'></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { reqEventExtraction, deleteEventExtraction, updateEventCount } from '@/api/eventExtraction.js'
import { mapGetters } from 'vuex'
import Modal from 'ant-design-vue/lib/modal/Modal'
import { notification } from 'ant-design-vue'

export default ({
  name: 'EventExtraction',
  data() {
    return {
      data: null,
      type: null,
      columns: [
        {
          title: 'id',
          key: 'id',
          dataIndex: 'id',
          width: "120px"
        },
        {
          title: '公司',
          dataIndex: 'company',
          key: 'company',
          width: '100px',
          ellipsis: true
        },
        {
          title: '时间',
          dataIndex: 'date',
          key: 'date',
          ellipsis: true
        },
        {
          title: '主题',
          dataIndex: 'event_name',
          key: 'event_name',
          ellipsis: true
        },
        {
          title: '经济损失',
          dataIndex: 'loss_economic',
          key: 'loss_economic'
        },
        {
          title: '伤亡人数',
          dataIndex: 'loss_people',
          key: 'loss_people'
        },
        {
          title: '地点',
          dataIndex: 'position',
          key: 'position'
        },
        {
          title: '事件类别',
          dataIndex: 'type',
          key: 'type',
          width: "120px"
        },
        {
          title: '事件类型',
          dataIndex: 'type_detail',
          key: 'type_detail',
          width: "140px"
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: "180px"
        }
      ],
      // 分页
      page_num: 1,
      page_size: 10,
      total: 0,
      // 上传
      uploadModalVisible: false,
      confirmLoading: false,
      file: null,
      fileList: [],
      // 更新
      updateModalVisible: false,
      form: {
        event_name: "",
        date: "",
        position: "",
        company: "",
        loss_people: "",
        loss_economic: "",
        type: "",
        type_detail: ""
      },
    }
  },
  computed:{
    ...mapGetters(['roleType'])
  },
  methods: {
    async handlePageChange(page_num, page_size) {
      let res = await reqEventExtraction({ page_num: page_num, page_size: page_size })
      this.data = res.result.event_count
      this.total = res.result.count
    },
    showUploadModal(){
      this.uploadModalVisible = true
    },
    handleOk(){
      this.confirmLoading = false
      this.uploadModalVisible = false
      this.updateModalVisible = false
    },
    updateEventExtraction(record){
      this.updateModalVisible = true
      this.form = record
    },
    closeModal(){
      this.form = {
        event_name: "",
        date: "",
        position: "",
        company: "",
        loss_people: "",
        loss_economic: "",
        type: "",
        type_detail: ""
      }
      this.updateModalVisible = false
    },
    async submitForm(){
      this.confirmLoading = true
      let res = await updateEventCount(this.form)
      if(res.code === 200){
        this.confirmLoading = false
        this.updateModalVisible = false
        this.getTableData()
        notification["success"]({
          message: '更新成功',
        });
      }
    },
    async getTableData(){
      let res = await reqEventExtraction({ page_num: 1, page_size: 10, type:this.type })
      this.data = res.result.event_count
      this.total = res.result.count
      this.page_num = res.result.page_num
      this.page_size = res.result.page_size
    },
    handleChange(info){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification["success"]({
          message: '上传成功',
        });
        this.getTableData()
      } else if (info.file.status === 'error') {
        notification["error"]({
          message: '上传失败',
        });
      }
    },
    async handleEventChange(page_num, page_size) {
      let res = await reqEventExtraction({ page_num: page_num, page_size: page_size })
      this.data = res.result.event_count
      this.total = res.result.count
    },
    deleteEventExtr(id) {
      const that = this
      this.$confirm({
        title: 'Are you sure delete this task?',
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          let res = await deleteEventExtraction({ id: id })
          if (res.code === 200) {
            that.$notification.open({
              message: '删除成功',
              duration: 1
            })
            // this.getTableData()
            // this.closeDialog()
            let res = await reqEventExtraction({ page_num: 1, page_size: 10 })
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
  created() {
    this.getTableData()
  }
})
</script>