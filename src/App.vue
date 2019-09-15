<template>
  <div id="app">
    我今年{{age}}岁
    <br />
    她的年龄{{herAge}}
    <button @click="syncAdd(1)">同步 点击按钮增加1岁</button>
    <button @click="asyncMinus(1)">异步 点击按钮减少1岁</button>
    <br />
    <br />
    模块内state：{{a.x}}
    <button @click="changeX(5)">更新x</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from './helpers'
export default {
  name: 'app',
  computed: {
    ...mapState(['age', 'a']),
    ...mapGetters(['herAge']),
  },
  methods: {
    ...mapMutations(['syncAdd', 'changeX']),
    ...mapActions(['asyncMinus']),
  },
  mounted() {
    console.log(this.$store.state)
  },
}
</script>