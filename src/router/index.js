import Vue from 'vue'
import Router from 'vue-router'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
  },
  routes: [
    {
      path: '/',
      name: 'Game',
      component: Game
    }
  ]
})
