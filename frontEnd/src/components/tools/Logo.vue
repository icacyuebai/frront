<template>
  <div class="logo">
    <router-link :to="{name:'Dashboard'}">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: '数据标注平台',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
