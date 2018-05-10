<template>
    <div>
        <head-top signin-up="msite" :head-title="msitetitle">
            <router-link :to="'/search/geohash'" class="link_search" slot="search">
                <svg width="100%" height="100%" xmnls="http://www.w3.org/2000/svg" version="1.1">
                    <circle cx="8" cy="8" r="7" stroke="rgba(255,255,255)" stroke-width="1" fill="none"/>
                    <line x1="13" y1="13" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2" />
                </svg>
            </router-link>
        </head-top>
        <nav class="msite_nav">
            <div class="swiper-container" v-if="foodTypes.length">
                <div class="swiper-wrapper">
                    <div class="swiper-slide food_types_container" v-for="(item, index) in foodTypes" :key="index">
                        <router-link :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}" v-for="foodItem in item" :key="foodItem.id" class="link_to_food">
                            <figure>
                                <img :src="imgBaseUrl + foodItem.image_url">
                                <figcaption>{{foodItem.title}}</figcaption>
                            </figure>
                        </router-link>
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </nav>
        <div class="shop_list_container">
            <header class="shop_header">
                <svg class="shop_icon">
                    <use xmnls:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
                </svg>
                <span class="shop_header_title">附件商家</span>
            </header>
            <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
        </div>
        <foot-guide></foot-guide>
    </div>
</template>

<script>
    import headTop from '@/components/head/head'
    import shopList from '@/components/common/shoplist'
    import footGuide from '@/components/footer/footGuide'
    import {mapMutations} from 'vuex'
    import {guessCity, msiteAddress, msiteFoodTypes} from '@/service/getData'
    import '@/plugins/swiper.min.js'
    import '@/style/swiper.min.css'
    export default {
        data(){
            return {
                geohash: '',  //页面传递过来的geohash
                msitetitle: '请选择地址...', // 标题
                foodTypes: [], // 食品分类列表
                hasGetData: false, // 是否已经获取地理位置
                imgBaseUrl: 'https://fuss10.elemecdn.com'  // 图片域名地址
            }
        },
        async beforeMount(){
            if (!this.$route.query.geohash) {
                const address = await guessCity();
                this.geohash = address.data.latitude + ',' + address.data.longitude;
            } else {
                this.geohash = this.$route.query.geohash
            }
            // 保存geohash 到vuex
            this.SAVE_GEOHASH(this.geohash);
            let res = await msiteAddress(this.geohash);
            this.msitetitle = res.data.name;
            // 记录当前经纬度
            this.RECORD_ADDRESS(res.data);
            this.hasGetData = true;
        },
        mounted(){
            // 获取导航类型
            msiteFoodTypes(this.geohash).then(res => {
                let dataLength = res.data.length;
                let dataArr = [...res.data];
                let foodArr = [];
                for (let i = 0, j = 0; i < dataLength; i += 8, j++){
                    foodArr[j] = dataArr.splice(0, 8);
                }
                this.foodTypes = foodArr;
            }).then(() => {
                //初始化swiper
                new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    loop: true
                });
            })
        },
        methods: {
            ...mapMutations([
                'SAVE_GEOHASH', 'RECORD_ADDRESS'
            ]),

            getCategoryId(url){
                let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
                if (/restaurant_category_id/gi.test(urlData)) {
                    return JSON.parse(urlData).restaurant_category_id.id;
                } else {
                    return '';
                }
            }
        },
        components: {
            headTop,
            shopList,
            footGuide
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .link_search{
        left: 0.8rem;
        @include wh(0.9rem, 0.9rem);
        @include ct;
    }
    .msite_nav{
        padding-top: 2.1rem;
        background-color: #fff;
        border-bottom: 0.025rem solid $bc;
        height: 10.6rem;
        .swiper-container{
            @include wh(100%, auto);
            padding-bottom: 0.6rem;
            .swiper-pagination{
                bottom: 0.2rem;
            }
        }
        .fl_back{
            @include wh(100%, 100%);
        }
    }
    .food_types_container{
        display: flex;
        flex-wrap: wrap;
        .link_to_food{
            width: 25%;
            padding: 0.3rem 0rem;
            @include fj(center);
            figure{
                img{
                    margin-bottom: 0.3rem;
                    @include wh(1.8rem, 1.8rem);
                }
                figcaption{
                    text-align: center;
                    @include sc(0.55rem, #666);
                }
            }
        }
    }
    .shop_list_container{
        margin-top: .4rem;
        border-top: 2px solid $bc;
        background-color: #fff;
        .shop_header{
            .shop_icon{
                fill: #999;
                margin-left: 0.6rem;
                vertical-align: middle;
                @include wh(0.6rem, 0.6rem);
            }
            .shop_header_title{
                color: #999;
                @include font(0.55rem, 1.6rem);
            }
        }
    }
</style>