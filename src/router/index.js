import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import UserCenter from '@/views/user-center/user-center'
import home from '@/views/home'
import rank from '@/views/rank'
import search from '@/views/search'

import songsList from '@/views/songsList/songsList'
import loading from '@/components/loading'
import singer from '@/views/singer/singer'
import singerDetail from '@/views/singer-detail/singer-detail'
import disc from '@/views/disc/disc'
import TopList from '@/views/top-list/top-list'

// const home = (resolve) => {
//     import ('@/views/home').then((module) => {
//         resolve(module)
//     })
// }

// const rank = (resolve) => {
//     import ('@/views/rank').then((module) => {
//         resolve(module)
//     })
// }

// const search = (resolve) => {
//     import ('@/views/search').then((module) => {
//         resolve(module)
//     })
// }

// const songsList = (resolve) => {
//     import ('@/views/songsList/songsList').then((module) => {
//         resolve(module)
//     })
// }

// const loading = (resolve) => {
//     import ('@/components/loading').then((module) => {
//         resolve(module)
//     })
// }

// const singer = (resolve) => {
//     import ('@/views/singer/singer').then((module) => {
//         resolve(module)
//     })
// }

// const singerDetail = (resolve) => {
//     import ('@/views/singer-detail/singer-detail').then((module) => {
//         resolve(module)
//     })
// }

// const disc = (resolve) => {
//     import ('@/views/disc/disc').then((module) => {
//         resolve(module)
//     })
// }

// const TopList = (resolve) => {
//     import ('@/views/top-list/top-list').then((module) => {
//         resolve(module)
//     })
// }

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'Home',
            component: home,
            children: [{
                path: ':id',
                component: disc
            }]
        },
        {
            path: '/rank',
            name: 'Rank',
            component: rank,
            children: [{
                path: ':id',
                component: TopList
            }, ]
        },
        {
            path: '/search',
            name: 'Search',
            component: search,
            children: [{
                path: ':id',
                component: singerDetail
            }]
        },
        {
            path: '/songsList',
            name: 'SongsList',
            component: songsList
        },
        {
            path: '/loading',
            component: loading
        },
        {
            path: '/singer',
            name: 'Singer',
            component: singer,
            children: [{
                path: ':id',
                component: singerDetail
            }]
        },
        {
            path: '/UserCenter',
            name: 'User',
            component: UserCenter
        }
    ]
})