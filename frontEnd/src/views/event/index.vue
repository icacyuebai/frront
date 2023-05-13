<template>
  <div :class='[$route.name === "EventDetail" ? "body-eventDetail" : "body-event"]'>
    <template v-if='$route.name === "Event"'>
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
      <a-button v-if='roleType==="admin"' class='right' @click='batchBind'>批量分配</a-button>
      <a-button v-if='roleType==="admin"' class='right' @click='showUploadModal("eventCOunt")' style='margin-right: 10px'>事件抽取批量上传</a-button>
      <a-button v-if='roleType==="admin"' class="right" @click='showUploadModal("event")' style='margin-right: 10px'>事件批量上传</a-button>
      <a-button v-if='roleType==="admin"' class='right' @click='updateJsonModalVisible = true' style='margin-right: 10px'>图谱批量上传</a-button>
    </div>
    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns" :data-source="data" :pagination="false" >
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="action" slot-scope="record">
        <a-button @click='detail(record.name)' type='link'>详情</a-button>
        <a-divider type="vertical" />
        <a-button v-if='roleType==="admin"' @click='bindUsers(record.name)' type='link'>分配</a-button>
<!--        <a-divider type="vertical" />-->
<!--        <a-button v-else @click='viewJson(record)' :disabled='!record.json' type='link'>查看图谱</a-button>-->
        <a-divider type="vertical" />
        <a-button @click='updateEvent(record)' type='link'>修改</a-button>
        <a-divider type="vertical" />
        <a-button v-if='roleType==="admin"' @click="deleteEvent(record.id)" type='link'>删除</a-button>
      </span>
    </a-table>
    <a-pagination
      style='margin-top: 20px;float: right'
      :default-current="page_num"
      :total="total"
      @change="handlePageChange" />
    <a-modal
      :title="updateType==='event' ? '上传事件文件' : '上传事件抽取文件'"
      v-model:visible="uploadModalVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <a-upload
        v-model:file-list="fileList"
        name="file"
        :multiple="true"
        :action="updateType==='event' ? '/api/event/upload' : '/api/eventCount/upload'"
        @change="handleChange"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          选择文件
        </a-button>
      </a-upload>
    </a-modal>

    <a-modal v-model:visible="updateModalVisible" title="修改事件" width='50%'>
      <template #footer>
        <a-button key="back" @click="closeModal">取消</a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="submitForm">提交</a-button>
      </template>
      <a-form :model="form">
        <a-form-item label="主题">
          <a-input v-model="form.name" :disabled='true'/>
        </a-form-item>
        <a-form-item label="简介">
          <a-input type='textarea' v-model='form.introduction'></a-input>
        </a-form-item>
        <a-form-item label="过程">
          <a-input type='textarea' v-model='form.process'></a-input>
        </a-form-item>
        <a-form-item label='url'>
          <a-input v-model='form.url'></a-input>
        </a-form-item>
        <a-form-item label='类型'>
          <a-input v-model='form.type' :disable="true"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:visible="bindModalVisible" title="分配事件" width='30%' height='60vh'>
      <template #footer>
        <a-button key="back" @click="closeModal">取消</a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="submitBindForm">提交</a-button>
      </template>
      <div style='height: 54vh;overflow: scroll'>
        <a-checkbox-group v-model='userIDList'>
          <a-checkbox style='display: block;margin-left: 8px;margin-top:12px' v-for='(item, index) in userList' :value='item.id'>{{item.name}}</a-checkbox>
        </a-checkbox-group>
      </div>
    </a-modal>

    <a-modal v-model:visible="updateJsonModalVisible" title="上传json" width='30%' height='60vh'>
      <template #footer>
        <a-button key="back" @click="closeModal">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="confirmLoading"
          @click="submitUpdateJson"
        >提交</a-button>
      </template>
      <a-upload :file-list="fileList" :multiple='true' :remove="handleRemove" :before-upload="convertJsonToEchartData">
        <a-button>
          选择文件
        </a-button>
      </a-upload>
    </a-modal>

    </template>
    <keep-alive v-else>
      <router-view key='eventDetail'></router-view>
    </keep-alive>
  </div>
</template>
<script>
import { reqEvent, deleteEvent, updateEvent, bindEvent, bindedUserIDList, updateJson } from '@/api/event.js'
import { reqUserList } from '@/api/user'
import { mapGetters } from 'vuex'
import { notification } from 'ant-design-vue';
import * as echarts from "echarts"
export default {
  name: 'Event',
  data() {
    return {
      data: null,
      selectedRowKeys: [], // Check here to configure the default column
      columns: [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
          width: '80px'
        },
        // {
        //   title: '简介',
        //   key:'introduction',
        //   dataIndex: 'introduction',
        //   ellipsis:true
        // },
        {
          title: '主题',
          key:'name',
          dataIndex: 'name',
          ellipsis:true,
          width: '80'
        },
        // {
        //   title: '发生经过',
        //   key:'process',
        //   dataIndex: 'process',
        //   ellipsis:true
        // },
        {
          title: '类型',
          key:'type',
          dataIndex: 'type',
          width: '90px'
        },
        // {
        //   title: 'url',
        //   key:'url',
        //   dataIndex: 'url'
        // },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '220'
        },
      ],
      page_num:1,
      page_size:10,
      total:0,
      type: null,
      // 文件上传
      updateType: "",
      uploadModalVisible: false,
      confirmLoading: false,
      file: null,
      fileList: [],
      // 上传json
      updateJsonModalVisible:false,
      json: null,
      jsons: [],
      // 展示json
      viewJsonModalVisible: false,
      myChart: null,
      jsonData: null,
      nodeForm: null,
      nodeIndex: null,
      nodeModalVisible: false,
      // 分配
      bindModalVisible: false,
      userIDList: [],
      userList:[],
      toBindEventName: "",
      // 更新
      updateModalVisible: false,
      form: {
        name: "",
        introduction: "",
        url: "",
        process: "",
        type: ""
      },
    };
  },
  computed:{
    ...mapGetters(['roleType']),
  },
  methods:{
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
    async handlePageChange(page_num, page_size) {
      let res = await reqEvent({ page_num: page_num, page_size: page_size })
      this.data = res.result.events
      this.total = res.result.count
    },
    async handleEventChange(page_num,page_size){
      let res = await reqEvent({page_num:page_num,page_size:page_size})
      this.data = res.result.events
      this.total = res.result.count
    },
    showUploadModal(type){
      this.updateType = type
      this.uploadModalVisible = true
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    closeModal(){
      this.form = {
        name: "",
        introduction: "",
        url: "",
        process: "",
        type: ""
      }
      this.toBindEventName = ""
      this.userIDList = []
      this.bindModalVisible = false
      this.updateModalVisible = false
      this.updateJsonModalVisible = false
      this.json = null
      this.jsons = []
      this.selectedRowKeys = []
      this.fileList = []
      this.getTableData()
    },
    async submitUpdateJson(){
      let res = await updateJson({jsons: this.jsons})
      if(res.code === 200){
        notification["success"]({
          message: '更新成功',
        });
        this.closeModal()
      }
    },
    detail(name){
      this.$router.push({path: "/event/eventDetail", query: {name: name}})
    },
    handleRemove(file){
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    convertJsonToEchartData(file){
      this.fileList = [...this.fileList, file];
      const that = this
      for(let i = 0; i < this.fileList.length; i++){
        let f = this.fileList[i]
        let reader = new FileReader()
        reader.readAsText(f, "UTF-8")
        reader.onload = _ =>{
          let json = JSON.parse(reader.result)
          let jsonFileName = f.name;

          // 每次增加的步长
          let stepX = 40;
          let stepY = 40;
          let positionDict = {};
          let dict_ls = [];
          let zeroPointPostionx = 100;
          let zeroPointPostiony = 100;

          let x = 0;
          let y = 0;

          dict_ls.push({ name: jsonFileName, x: x, y: y });

          // 关系列表
          let links = [];

          // 子分支列表存放
          let next_ls = [];

          // 存放第一层分支的数量
          let fatherNum = 0;
          for (let name in json) {
            let dict = {};
            dict["name"] = name;

            // 是否是第一层分支
            if (next_ls.indexOf(name) === -1) {
              fatherNum++;
              if(fatherNum%2 == 0){
                x = zeroPointPostionx - stepX;
                y = zeroPointPostiony - stepY * fatherNum;
                dict["x"] = x;
                dict["y"] = y;
              }else{
                x = zeroPointPostionx - stepX;
                y = zeroPointPostiony - stepY * fatherNum;
                dict["x"] = x;
                dict["y"] = y;
              }

              positionDict[name] = { x:-2*x, y: y };
              links.push({
                target: name,
                source: jsonFileName,
              });
            } else {
              dict["x"] = positionDict[name].x;
              dict["y"] = positionDict[name].y;
            }

            let sonNum = 0;
            for (let val in json[name]) {
              let key = json[name][val];
              let links_item = {};
              if (key[0] === "next") {
                sonNum = sonNum + 1;
                next_ls.push(val);
                let x = positionDict[name].x + stepX;
                let y = positionDict[name].y + stepY * sonNum;
                positionDict[val] = { x: x, y: y };
                links_item["target"] = val;
                links_item["source"] = name;
                links.push(links_item);
              } else {
                dict[key] = val;
              }
            }
            dict_ls.push(dict);
          }
          that.jsons.push({
            name: jsonFileName,
            json: JSON.stringify({
              dict_ls: dict_ls,
              links: links
            })
          })
        }
      }
      return false;
    },
    handleOk(){
      this.confirmLoading = false
      this.uploadModalVisible = false
      this.updateModalVisible = false
    },
    async getTableData(){
      let res = await reqEvent({page_num:1,page_size:10,type: this.type})
      this.data = res.result.events
      this.total = res.result.count
      this.page_num = res.result.page_num
      this.page_size = res.result.page_size
    },
    async submitForm(){
      this.confirmLoading = true
      let res = await updateEvent(this.form)
      if(res.code === 200){
        this.confirmLoading = false
        this.updateModalVisible = false
        this.getTableData()
        notification["success"]({
          message: '更新成功',
        });
      }
    },
    handleChange(info){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification["success"]({
          message: '上传成功',
        });
      } else if (info.file.status === 'error') {
        notification["error"]({
          message: '上传失败',
        });
      }
    },
    async batchBind(){
      if(!this.selectedRowKeys.length){
        notification["error"]({
          message: '请选择要分配的事件',
        });
        return
      }
      this.bindModalVisible = true
      this.toBindEventName = "batchBind"
      await this.getBindedUserIDList()
    },
    async bindUsers(name){
      this.bindModalVisible = true
      this.toBindEventName = name
      await this.getBindedUserIDList()
    },
    async getBindedUserIDList(){
      let res = await bindedUserIDList({event_name: this.toBindEventName})
      if(res.code === 200){
        this.userIDList = res.result.bindedUserIDList
      }
    },
    async submitBindForm(){
      if(!this.toBindEventName || !this.userIDList.length){
        notification["error"]({
          message: '关键数据缺失，请重试！',
        });
        return
      }
      let res
      let count = 0
      if(this.toBindEventName !== "batchBind"){
        res = await bindEvent({name:this.toBindEventName, userIDList: this.userIDList})
        if(res.code === 200){
          count += 1
        }
      }else{
        for (const row of this.selectedRowKeys) {
          res = await bindEvent({name:row.name, userIDList: this.userIDList})
          if(res.code === 200){
            count += 1
          }
        }
      }
      notification["success"]({
        message: '分配成功,' + count + '条' ,
      });
      this.closeModal()

    },
    updateEvent(record){
      this.updateModalVisible = true
      this.form = record
    },
    deleteEvent(id) {
      const that = this
      this.$confirm({
        title: '确定要删除该事件吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
            let res = await deleteEvent({ id: id })
            if (res.code === 200) {
              that.$notification.open({
                message: '删除成功',
                duration: 1,
              });
              this.getTableData()
            }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    async getUserList(){
      let res = await reqUserList({page_num:1, page_size:9999})
      if(res.code === 200){
        this.userList = res.result.users
      }
    }
  },
  created(){
    this.getTableData()
    this.getUserList()
  }
}
</script>
<style lang='less' scoped>

.body-eventDetail{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #f0f2f5;
}
</style>
