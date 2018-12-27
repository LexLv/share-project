// import Vue from 'vue'
// import Router from 'vue-router'
import Vote from '@/components/pages/bch/vote'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'vote',
      component: Vote
    }
  ]
})
