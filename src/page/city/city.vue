<template>
    <div class="city_container">
        <head-top :head-title="cityname" go-back="true">
           <router-link to="/home" slot="changecity" class="change_city">切换城市</router-link>
        </head-top>
        <form class="city_form" v-on:submit.prevent>
            <div>
                <input type="search" name="city" placeholder="输入学校、商务楼、地址" class="city_input input_style" required v-model="inputValue">
            </div>
            <div>
                <input type="submit" name="submit" class="city_submit input_style" @click="postpois" value="提交">
            </div>
        </form>
        <header v-if="historytitle" class="pois_search_history">搜索历史</header>
        <ul class="getpois_ul">
            <li v-for="(item, index) in placelist" @click="nextpage(index, item.geohash)" :key="index">
                <h4 class="pois_name ellipsis">{{item.name}}</h4>
                <p class="pois_address ellipsis">{{item.address}}</p>
            </li>
        </ul>
        <footer v-if="historytitle && placelist.length" class="clear_all_history" @click="clearAll">清空所有</footer>
        <div class="search_none_place" v-if="placeNone">很抱歉！无搜索结果</div>
    </div>
</template>

<script>
    import headTop from '@/components/head/head'
    import {currentCity, searchPlace} from '@/service/getData'
    import {setStore, getStore, removeStore} from '@/config/mUtils'

    export default {
        data(){
            return {
                cityname: '',   // 当前城市名字
                cityid: '',  // 当前城市id
                inputValue: '', // 搜索地址
                placelist: [], // 搜索列表
                placeHistory: [], // 历史搜索记录
                historytitle: true, 
                placeNone: false  // 搜索无结果，显示提示信息
            }
        },
        mounted(){
            this.cityid = this.$route.params.cityid;

            // 获取当前城市名字
            currentCity(this.cityid).then(res => {
                this.cityname = res.data.name;
            })

            this.initData();
        },
        methods: {
            // 搜索地址
            postpois(){
                removeStore('placeHistory');
                if (this.inputValue) {
                    searchPlace(this.cityid, this.inputValue).then(res => {
                        this.historytitle = false;
                        this.placelist = res.data;
                        this.placeNone = res.data.length ? false : true;
                    })
                }
            },

            // 点击搜索结果进入下一页面，判断搜索结果是否在历史记录，若没有则新增
            nextpage(index, geohash){
                let history = getStore('placeHistory');
                let choosePlace = this.placelist[index];
                if (history) {
                    let checkrepeat = false;
                    this.placeHistory = JSON.parse(history);
                    this.placeHistory.forEach(item => {
                        if (item.geohash == geohash) {
                            checkrepeat = true;
                        }
                    })
                    if (!checkrepeat) {
                        this.placeHistory.push(choosePlace);
                    }
                } else {
                    this.placeHistory.push(choosePlace);
                }
                setStore('placeHistory', this.placeHistory)
                this.$router.push({path:'/msite', query:{geohash}})
            },

            // 清除历史记录
            clearAll(){
                removeStore('placeHistory');
                this.initData();
            },

            // 获取搜索历史记录
            initData(){
                if (getStore('placeHistory')) {
                    this.placelist = JSON.parse(getStore('placeHistory'));
                } else {
                    this.placelist = [];
                }
            }
        },
        components: {
            headTop
        }

    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    
    .city_container{
        padding-top: 2.35rem;
    }
    .change_city{
        right: 0.4rem;
        @include sc(0.6rem, #fff);
        @include ct;
    }
    .city_form{
        background-color: #fff;
        border-top: 1px solid $bc;
        border-bottom: 1px solid $bc;
        padding-top: 0.4rem;
        div{
            width: 90%;
            margin: 0 auto;
            text-align: center;
            .input_style{
                border-radius: 0.1rem;
                margin-bottom: 0.4rem;
                @include wh(100%, 1.4rem);
            }
            .city_input{
                border: 1px solid $bc;
                padding: 0 0.3rem;
                @include sc(0.65rem, #333);
            }
            .city_submit{
                background-color: $blue;
                @include sc(0.65rem, #fff);
            }
        }
    }
    .pois_search_history{
        border-top: 1px solid $bc;
        border-bottom: 1px solid $bc;
        @include font(0.475rem, 0.8rem);
        padding: 0 0.5rem;
    }
    .getpois_ul{
        background-color: #fff;
        border-top: 1px solid $bc;
        li{
            border-bottom: 1px solid $bc;
            margin: 0 auto;
            padding-top: 0.65rem;
            .pois_name{
                width: 90%;
                margin: 0 auto 0.35rem;
                @include sc(0.65rem, #333); 
            }
            .pois_address{
                width: 90%;
                margin: 0 auto 0.55rem;
                @include sc(0.45rem, #999)
            }
        }
    }
    .clear_all_history{
        @include sc(0.7rem, #666);
        text-align: center;
        line-height: 2rem;
        background-color: #fff;
    }
    .search_none_place{
        margin: 0 auto;
        @include font(0.65rem, 1.75rem);
        color: #333;
        background-color: #fff;
        text-indent: 0.5rem;
    }
</style>