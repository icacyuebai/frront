<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="10">
        <a-card title="主题" :bordered="false">
          <p>{{event.name || ""}}</p>
        </a-card>
      </a-col>
      <a-col :span="4">
        <a-card title="类型" :bordered="false">
          <p>{{event.type || ""}}</p>
        </a-card>
      </a-col>
      <a-col :span="10">
        <a-card title="URL" :bordered="false">
          <p>{{event.url || ""}}</p>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter='16' style='margin-top: 16px'>
      <a-col :span='24'>
        <a-card title="事件简介" :bordered="false">
          {{event.introduction || ""}}
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter='16' style='margin-top: 16px'>
      <a-col :span='24'>
        <a-card title="事件经过" :bordered="false">
          {{event.process || ""}}
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter='16' style='margin-top: 16px'>
      <a-col :span='24'>
        <a-card title="事件抽取" :bordered="false">
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
              <template v-if='record.is_pass !== "1"'>
                <a-button @click="pass(record.id)" type='link'>通过</a-button>
                <a-button @click="updateEventExtraction(record)" type='link'>修正</a-button>
                <a-button v-if='roleType==="admin"' @click='deleteEventExtr(record.id)' type='link'>删除</a-button>
              </template>
              <template v-else>
                <a-button type='link' disabled>已标记成功</a-button>
              </template>
            </span>
          </a-table>
          <a-pagination
            style='margin-top: 20px;float: right'
            :default-current="page_num"
            :total="total"
            @change="handlePageChange" />
        </a-card>
      </a-col>
    </a-row>
    <a-row style='margin-top: 16px'>
      <a-col :span='24'>
        <a-card title='标注规则' :bordered='false'>
          <p>请从以下15种事件名称中对事件类型进行标注</p>
          <p>物体打击事故、车辆伤害事故、机械伤害事故、高处坠落事故、坍塌事故、锅炉事故、压力容器事故、矿山事故、中毒窒息事故、起重事故、爆炸事故、火灾事故、淹溺事故、空难事故、电气事故</p>
          <p style='font-size: 14px;font-weight: 600'>时间标注规则</p>
          <p>时间请写*年*月*日 或 *.*</p>
          <p style='font-size: 14px;font-weight: 600'>伤亡人数标注规则</p>
          <p>*人死亡（伤亡/受伤）</p>
          <p style='font-size: 14px;font-weight: 600'>经济损失标注规则</p>
          <p>经济损失*（万）元</p>
        </a-card>
      </a-col>
    </a-row>
    <a-row style='margin-top: 16px'>
      <a-col :span='24'>
        <a-card title="图谱" :bordered="false">
          <div id="echarts" style="height: 700px; width: 1500px"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      title="上传事件文件"
      v-model:visible="uploadModalVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <a-upload
        v-model:file-list="fileList"
        name="file"
        :multiple="true"
        action="/api/eventCount/upload"
        @change="handleChange"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          上传文件
        </a-button>
      </a-upload>
    </a-modal>

    <a-modal v-if='nodeForm' :title='nodeForm.name' v-model:visible="nodeModalVisible" width='40%' height='40%'>
      <template #footer>
        <a-button key="back" @click="closeNodeModal">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="confirmLoading"
          @click="submitUpdateNode"
        >提交</a-button>
      </template>
      <a-form labelAlign='left'>
        <template v-for='key in Object.keys(nodeForm)'>
          <a-form-item
            v-if='["name", "x", "y"].indexOf(key)===-1'
            :labelCol='{span:8}'
            :wrapperCol='{span: 14}'
            :label='key'>
            <a-input v-model='nodeForm[key]'></a-input>
          </a-form-item>
        </template>
      </a-form>
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
import { getEventDetail, updateJson } from '@/api/event'
import { reqEventExtraction, deleteEventExtraction, updateEventCount, passEventExtraction } from '@/api/eventExtraction.js'
import { mapGetters } from 'vuex'
import Modal from 'ant-design-vue/lib/modal/Modal'
import { notification } from 'ant-design-vue'
import * as echarts from 'echarts'

export default {
  name: 'EventDetail',
  data() {
    return {
      event: {
        url: "",
        name: "",
        introduction: "",
        process: "",
        type: ""
      },
      type: null,
      data:null,
      columns: [
        {
          title: 'id',
          key: 'id',
          dataIndex: 'id',
          width: "100px"
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
      event_name: null,
      // json
      json: null,
      toUpdateJsonRecord: null,
      jsons: [],
      // 展示json
      viewJsonModalVisible: false,
      myChart: null,
      jsonData: null,
      nodeForm: null,
      nodeIndex: null,
      nodeModalVisible: false,
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
    };
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
    showUploadModal() {
      this.uploadModalVisible = true
    },
    handleOk() {
      this.confirmLoading = false
      this.uploadModalVisible = false
      this.updateModalVisible = false
    },
    async pass(id){
      let res = await passEventExtraction({id:id})
      if(res.code === 200){
        notification["success"]({
          message: '标记成功',
        });
        this.getTableData()
      }
    },
    updateEventExtraction(record) {
      this.updateModalVisible = true
      this.form = record
    },
    closeModal() {
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
    async submitUpdateNode(){
      if(!this.json){
        return
      }
      this.json.dict_ls[this.nodeIndex] = this.nodeForm
      let res = await updateJson({id: this.toUpdateJsonRecord.id, json: JSON.stringify(this.json)})
      if(res.code === 200){
        notification["success"]({
          message: '更新成功',
        });
        this.closeNodeModal()
      }
    },
    async submitForm() {
      this.confirmLoading = true
      let res = await updateEventCount(this.form)
      if (res.code === 200) {
        this.confirmLoading = false
        this.updateModalVisible = false
        this.getTableData()
        notification["success"]({
          message: '更新成功',
        });
      }
    },
    async getTableData() {
      let res = await reqEventExtraction({ page_num: 1, page_size: 10, type: this.type, event_name: this.event_name })
      this.data = res.result.event_count
      this.total = res.result.count
      this.page_num = res.result.page_num
      this.page_size = res.result.page_size
    },
    handleChange(info) {
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
    },
    closeNodeModal(){
      this.nodeModalVisible = false
      this.nodeForm = null
      this.nodeIndex = null
    },
    initEchart() {
      if(!this.myChart){
        let dom = document.getElementById("echarts");
        this.myChart = echarts.init(dom);
      }
      var option;
      option = {
        tooltip: {
          formatter: function(params) {
            let data = params.data
            let html = '<div style="width:280px;height:180px;background:#5370c6;border:1px solid rgba(7,166,255,0.7)">'
              +'<div style="width:100%;min-height:22px;line-height:22px;border-bottom:2px solid rgba(7,166,255,0.7);padding:0 20px">'
              +'<span style="color:#fff;font-size:14px;word-wrap:break-word;white-space:normal;">'+params.name+'</span>'+'</div>'
              +'<div style="padding:20px">'
            for(let key in data){
              if(["name", "x", "y"].indexOf(key) === -1){
                html+=`<p style="color:#fff;font-size:12px;">
                        ${key}: ${data[key]}</span>
                       </p>`
              }
            }
            html += '</div>'+'</div>';
            return html;
          }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 50,
            roam: true,
            label: {
              formatter: '{b}',
              show: true,
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20,
            },
            data: this.json.dict_ls,
            links: this.json.links,
            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0,
            },
          },
        ],
      };
      option && this.myChart.setOption(option);
      const that = this
      this.myChart.on('click', function (params) {
        let data = params.data
        // 如果除了name,x,y外无其他的key，则不弹窗
        if(params.data && Object.keys(data).length>3){
          that.nodeModalVisible = true
          that.nodeForm = data
          that.nodeIndex = params.dataIndex
        }
      });
    },
  },
  async created(){
    if(this.$route.query && this.$route.query.name){
      this.event_name = this.$route.query.name
      let res = await getEventDetail({name: this.event_name})
      if(res.code === 200){
        this.event = res.result.event;
        if(this.event.json){
          this.json = JSON.parse(this.event.json)
          this.toUpdateJsonRecord = this.event
          const that = this
          this.$nextTick(()=>{
            that.initEchart()
          })
        }
      }
      await this.getTableData()
    }
  }
}
</script>

<style lang='less' scoped>
</style>