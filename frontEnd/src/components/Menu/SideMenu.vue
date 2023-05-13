<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <logo />
    <a-menu v-model:selectKeys="selectKeys" mode='inline' @select="onSelect">
      <a-menu-item v-for="(item, index) in menus" :key='item.name'>
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
    </a-menu>
<!--    <s-menu-->
<!--      :collapsed="collapsed"-->
<!--      :menu="menus"-->
<!--      :theme="theme"-->
<!--      :mode="mode"-->
<!--      @select="onSelect"-->
<!--      style="padding: 16px 0px;"></s-menu>-->
  </a-layout-sider>

</template>

<script>
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'SideMenu',
  components: { Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data(){
    return{
      selectKeys: ["Dashboard"]
    }
  },
  watch:{
    $route(){
      this.selectKeys = [this.$route.name]
    }
  },
  methods: {
    onSelect (obj) {
     this.$router.push({name: obj.key})
    }
  },
  created() {
    this.selectKeys = [this.$route.name]
  }
}
</script>
