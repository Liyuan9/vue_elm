import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
    latitude: '',//当前位置纬度
    longitude: '',//当前位置经度
    geohash: '31.22299,121.36025',//地址geohash值
    cartList: {},// 购物车列表
    shopDetail: null, //商家详情信息
    shopid: null, //商铺ID
}

export default new Vuex.Store({
    state,
    actions,
    mutations
})