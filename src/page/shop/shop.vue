<template>
    <div>
        <section v-if="!showLoading" class="shop_container">
            <nav class="goback" ref="navTop">
                <img :src="imgBaseUrl + shopDetailData.image_path" class="nav_back_img">
                <svg width="1.5rem" height="100%" xmnls="http://www.w3.org/2000/svg" version="1.1" @click="goback">
                    <polyline points="12,18 4,9 12,0" style="fill:none; stroke:rgb(255,255,255); stroke-width:2" />
                    <polyline points="4,9 20,9" style="fill:none; stroke:rgb(255,255,255); stroke-width:2" />
                </svg>
            </nav>
            <header class="shop_detail_header" ref="shopheader" :style="{zIndex: showActivities? '14': ''}">
                <section class="description_header">
                    <section class="description_left">
                        <img :src="imgBaseUrl + shopDetailData.image_path">
                    </section>
                    <section class="description_right">
                        <h4 class="description_title ellipsis">{{shopDetailData.name}}</h4>
                        <p class="description_text">商家配送/{{shopDetailData.order_lead_time}}分钟送达/配送费¥{{shopDetailData.float_delivery_fee}}</p>
                        <p class="description_promotion ellipsis">公告：{{promotionInfo}}</p>
                    </section>
                    <footer class="description_footer" v-if="shopDetailData.activities.length" @click="showActivitiesFun">
                        <p class="ellipsis">
                            <span class="tip_icon" :style="{backgroundColor: '#' + shopDetailData.activities[0].icon_color,borderColor: '#' + shopDetailData.activities[0].icon_color}">
                                {{shopDetailData.activities[0].icon_name}}
                            </span>
                            <span>{{shopDetailData.activities[0].description}}（APP专享）</span>
                        </p>
                        <p>{{shopDetailData.activities.length}}个活动</p>
                    </footer>
                </section>
            </header>
            <transition name="fade">
                <section class="activities_details" v-if="showActivities">
                    <h2 class="activities_shoptitle">{{shopDetailData.name}}</h2>
                    <h3 class="activities_ratingstar">
                        <rating-star :rating='shopDetailData.rating'></rating-star>
                    </h3>
                    <section class="activities_list">
                        <header class="activities_title_style">
                            <span>优惠信息</span>
                        </header>
                        <ul>
                            <li v-for="item in shopDetailData.activities" :key="item.id">
                                <span class="activities_icon" :style="{backgroundColor: '#' + item.icon_color, borderColor: '#' + item.icon_color}">{{item.icon_name}}</span>
                                <span>{{item.description}}（APP专享）</span>
                            </li>
                        </ul>
                    </section>
                    <section class="activities_shopinfo">
                        <header class="activities_title_style"><span>商家公告</span></header>
                        <p>{{promotionInfo}}</p>
                    </section>
                    <svg width="60" height="60" class="close_activities" @click.stop="showActivitiesFun">
                        <circle cx="30" cy="30" r="25" stroke="#555" stroke-width="1" fill="none"/>
                        <line x1="22" y1="38" x2="38" y2="22" stroke="#999" stroke-width="2"/>
                        <line x1="22" y1="22" x2="38" y2="38" stroke="#999" stroke-width="2"/>
                    </svg>
                </section>
            </transition>
            <section class="change_show_type" ref="chooseType">
                <div>
                    <span :class='{activity_show: changeShowType == "food"}' @click="changeShowType='food'">商品</span>
                </div>
                <div>
                    <span :class='{activity_show: changeShowType == "rating"}' @click="changeShowType='rating'">评价</span>
                </div>
                <div>
                    <span :class='{activity_show: changeShowType == "shop"}' @click="changeShowType='shop'">商家</span>
                </div>
            </section>
            <transition name="fade-choose">
                <section v-show="changeShowType == 'food'" class="food_container">
                    <section class="menu_container">
                        <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
                            <ul>
                                <li v-for="(item, index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu: index == menuIndex}" @click="chooseMenu(index)">
                                    <img :src="getImgPath(item.icon_url)" v-if="item.icon_url">
                                    <span>{{item.name}}</span>
                                    <span class="category_num" v-if="categoryNum[index]&&item.type==1">{{categoryNum[index]}}</span>
                                </li>
                            </ul>
                        </section>
                        <section class="menu_right" ref="menuFoodList">
                            <ul>
                                <li v-for="(item, index) in menuList" :key="index">
                                    <header class="menu_detail_header">
                                        <section class="menu_detail_header_left">
                                            <strong class="menu_item_title">{{item.name}}</strong>
                                            <span class="menu_item_description">{{item.description}}</span>
                                        </section>
                                        <span class="menu_detail_header_right" @click="showTitleDetail(index)"></span>
                                        <p class="description_tip" v-if="index == TitleDetailIndex"><span>{{item.name}}</span>
                                            {{item.description}}
                                        </p>
                                    </header>
                                    <section v-for="(foods, foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                                        <router-link :to="{path: 'shop/foodDetail', query:{image_path:foods.image_path, description: foods.description, month_sales: foods.month_sales, name: foods.name, rating: foods.rating, rating_count: foods.rating_count, satisfy_rate: foods.satisfy_rate, foods, shopId}}" tag="div" class="menu_detail_link">
                                            <section class="menu_food_img">
                                                <img :src="imgBaseUrl + foods.image_path">
                                            </section>
                                            <section class="menu_food_description">
                                                <h3 class="food_description_head">
                                                    <strong class="description_foodname">{{foods.name}}</strong>
                                                    <ul v-if="foods.attributes.length" class="attributes_ul">
                                                        <li v-for="(attribute, foodindex) in foods.attributes" :key="foodindex" :style="{color: '#' + attribute.icon_color,borderColor:'#' +attribute.icon_color}" :class="{attribute_new: attribute.icon_name == '新'}">
                                                            <p :style="{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}">{{attribute.icon_name == '新'? '新品':attribute.icon_name}}</p>
                                                        </li>
                                                    </ul>
                                                </h3>
                                                <p class="food_description_content">{{foods.description}}</p>
                                                <p class="food_description_sale_rating">
                                                    <span>月售{{foods.month_sales}}份</span>
                                                    <span>好评率{{foods.satisfy_rate}}%</span>
                                                </p>
                                                <p v-if="foods.activity" class="food_activity">
                                                <span :style="{color: '#' + foods.activity.image_text_color,borderColor:'#' +foods.activity.icon_color}">{{foods.activity.image_text}}</span>
                                                </p>
                                            </section>
                                        </router-link>
                                        <footer class="menu_detail_footer">
                                            <section class="food_price">
                                                <span>¥</span>
                                                <span>{{foods.specfoods[0].price}}</span>
                                                <span v-if="foods.specifications.length">起</span>
                                            </section>
                                            <buy-cart :shopId='shopId' :foods='foods' @moveIncart="listenInCart" @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>
                                        </footer>
                                    </section>
                                </li>
                            </ul>
                        </section>
                    </section>
                    <section class="buy_cart_container">
                        <section @click="toggleCartList" class="cart_icon_num">
                            <div class="cart_icon_container" :class="{cart_icon_activity:totalPrice > 0, move_in_cart:receiveInCart}" ref="cartContainer">
                                <span v-if="totalNum" class="cart_list_length">
                                    {{totalNum}}
                                </span>
                                <svg class="cart_icon">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
                                </svg>
                            </div>
                        </section>
                    </section>
                </section>
            </transition>
        </section>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import {msiteAddress, shopDetails, foodMenu} from '@/service/getData'
    import loading from '@/components/common/loading'
    import ratingStar from '@/components/common/ratingStar'
    import buyCart from '@/components/common/buyCart'
    import {loadMore, getImgPath} from '@/components/common/mixin'
    import BScroll from 'better-scroll'

    export default {
        data(){
            return {
                geohash: '',
                windowHeight: null,// 屏幕的高度
                shopId: null,
                showLoading: true,// 显示加载动画
                showActivities: false,// 是否显示活动详情
                imgBaseUrl: 'http://cangdu.org:8001/img/', // 图片地址
                shopDetailData: null,// 商铺详情
                menuList: [],// 商家菜单
                changeShowType: 'food',// 切换显示商品或评价
                menuIndex: 0,// 已选菜单索引值，默认为0
                categoryNum: [],// 商品类型右上角已加入购物车的数量
                TitleDetailIndex: null,// 点击展示列表头部详情
                menuIndexChange: true,
                shopListTop: [],
                foodScroll: null,// 食品列表scroll
                totalPrice: 0,// 总共价格
                cartFoodList: [],// 购物车商品列表
                showCartList: false,// 显示购物车列表
                receiveInCart: false,// 购物车组件下落的圆点是否到达目标位置
                //showMoveDot: [],// 控制下落的小圆点显示隐藏
                //elLeft: 0,// 当前点击加按钮在网页中的绝对left值
                //elBottom: 0,// 当前点击加按钮在网页中的绝对bottom值
            }
        },
        created(){
            this.geohash = this.$route.query.geohash;
            this.shopId = this.$route.query.id;
            this.INIT_BUYCART();
        },
        mounted(){
            this.initData();
            this.windowHeight = window.innerHeight;
        },
        computed: {
            ...mapState([
                'latitude',
                'longitude'
            ]),
            // 商铺信息介绍
            promotionInfo(){
                return this.shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。';
            },
            // 配送费
            deliveryfee(){
                if (this.shopDetailData) {
                    return this.shopDetailData.float_delivery_fee;
                } else {
                    return null;
                }
            },
            // 购物车中商品数量
            totalNum(){
                let num = 0;
                this.cartFoodList.forEach(item => {
                    num += item.num;
                })
                return num;
            }

        },
        mixins: [loadMore, getImgPath],
        components: {
            loading,
            ratingStar,
            buyCart
        },
        methods: {
            ...mapMutations([
                'RECORD_ADDRESS', 'ADD_CART', 'REDUCE_CART', 'INIT_BUYCART'
            ]),
            async initData(){
                if (!this.latitude) {
                    let res = await msiteAddress(this.geohash);
                    this.RECORD_ADDRESS(res.data);
                }
                // 获取商铺信息
                let shop = await shopDetails(this.shopId, this.latitude, this.longitude);
                this.shopDetailData = shop.data;
                // 获取商铺菜单
                let menu = await foodMenu(this.shopId);
                this.menuList = menu.data;
                // 隐藏加载动画
                this.hideLoading();
            },
            // 获取食品列表的高度，存入shopListTop
            getFoodListHeight(){
                const listContainer = this.$refs.menuFoodList;
                const listArr = Array.from(listContainer.children[0].children);
                listArr.forEach((item, index) => {
                    this.shopListTop[index] = item.offsetTop;
                });
                if(this.$refs.chooseType.offsetTop > this.$refs.navTop.offsetTop){
                    console.log(1);
                } else {
                    this.listenScroll(listContainer);
                }
            },
            // 当滑动食品列表时， 监听其scrollTop值
            listenScroll(element){
                this.foodScroll = new BScroll(element, {
                    probeType: 2,
                    deceleration: 0.001,
                    bounce: false,
                    swipeTime: 2000,
                    click: true
                });
                const wrapperMenu = new BScroll('#wrapper_menu', {
                    click: true
                });
                const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight;
                this.foodScroll.on('scroll', (pos) => {
                    if (!this.$refs.wrapperMenu) {
                        return
                    }
                    this.shopListTop.forEach((item, index) => {
                        if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
                            this.menuIndex = index;
                            const menuList = this.$refs.wrapperMenu.querySelectorAll('.activity_menu');
                            const el = menuList[0];
                            wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight/2 - 50));
                        }
                    })
                })
            },
            goback(){

            },
            showActivitiesFun(){

            },
            // 隐藏动画
            hideLoading(){
                this.showLoading = false;
            },
            // 选择菜单
            chooseMenu(index){
                this.menuIndex = index;
                this.menuIndexChange = false
                this.foodScroll.scrollTo(0, -this.shopListTop[index], 400);
                this.foodScroll.on('scrollEnd', () => {
                    this.menuIndexChange = true;
                })
            },
            // 点击显示头部详情
            showTitleDetail(){

            },
            // 监听是否进入购物车
            listenInCart(){

            },
            // 显示规格列表
            showChooseList(){

            },
            // 显示提示：无法减去商品
            showReduceTip(){

            },
            // 显示下落圆球
            showMoveDotFun(showMoveDot, elLeft, elBottom){

            },
            // 控制购物车列表是否显示
            toggleCartList(){
                this.cartFoodList.length ? this.showCartList = !this.showCartList : true;
            }
        },
        watch: {
            showLoading: function(value){
                if (!value) {
                    this.$nextTick(() => {
                        this.getFoodListHeight();
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    @keyframes mymove{
        0% { transform: scale(1) }
        25% { transform: scale(.8) }
        50% { transform: scale(1.1) }
        75% { transform: scale(.9) }
        100% { transform: scale(1) }
    }
    @-moz-keyframes mymove{
        0% { transform: scale(1) }
        25% { transform: scale(.8) }
        50% { transform: scale(1.1) }
        75% { transform: scale(.9) }
        100% { transform: scale(1) }
    }
    @-webkit-keyframes mymove{
        0% { transform: scale(1) }
        25% { transform: scale(.8) }
        50% { transform: scale(1.1) }
        75% { transform: scale(.9) }
        100% { transform: scale(1) }
    }
    @-o-keyframes mymove{
        0% { transform: scale(1) }
        25% { transform: scale(.8) }
        50% { transform: scale(1.1) }
        75% { transform: scale(.9) }
        100% { transform: scale(1) }
    }
    .shop_container{
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 0;
        left: 0;
        height: 100%;
    }
    .goback{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3.5rem;
        z-index: 11;
        overflow: hidden;
        background-color: #a6a6a6;
        .nav_back_img{
            width: 100%;
            filter: blur(30px);
        }
        svg{
            position: absolute;
            top: 0;
            left: 0;
            padding: 0.4rem 0 0 0.2rem;
        }
    }
    .shop_detail_header{
        position: relative;
        margin-top: 3.5rem;
        .description_header{
            position: releative;
            background-color: #fff;
            padding: 0.4rem 0 0.4rem 0.4rem;
            width: 100%;
            display: flex;
            flex-direction: column;  
            .description_left{
                text-align: center;
                margin-top: -2.5rem;
                z-index: 12;
                img{
                    @include wh(2.9rem, 2.9rem);
                    display: inline-block;
                    border-radius: 0.15rem;
                }
            }
            .description_right{
                flex: 1;
                text-align: center;
                .description_title{
                    @include sc(0.8rem, #222);
                    font-weight: bold;
                    width: 100%;
                    margin-bottom: 0.3rem;
                }
                .description_text{
                    @include sc(0.5rem, #999);
                    margin-bottom: 0.3rem;
                }
                .description_promotion{
                    @include sc(0.5rem, #666);
                    width: 100%;
                    padding: 0.1rem 0.5rem
                }
            }
            .description_arrow{
                @include ct;
                right: 0.3rem;
                z-index: 11;
            }
            
            .description_footer{
                @include fj;
                margin-top: 0.5rem;
                padding-right: 1rem;
                p{
                    @include sc(0.5rem, #fff);
                    span{
                        color: #fff;
                    }
                    .tip_icon{
                        padding: 0 0.04rem;
                        border: 0.025rem solid #fff;
                        border-radius: 0.1rem;
                        font-size: 0.4rem;
                        display: inline-block;
                    }
                }
                .ellipsis{
                    width: 84%;
                }
                .footer_arrow{
                    @include wh(0.45rem, 0.45rem);
                    position: absolute;
                    right: 0.3rem;
                }
            }
        }
    }
    .activities_details{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #262626;
        z-index: 200;
        padding: 1.25rem;

    }
    .change_show_type{
        display:flex;
        background-color: #fff;
        padding: 0.3rem 0 0.6rem;
        border-bottom: 1px solid #ebebeb;
        div{
            flex: 1;
            text-align: center;
            span{
                @include sc(0.65rem, #666);
                padding: 0.2rem 0.1rem;
                border-bottom: 0.12rem solid #fff;
            }
            .activity_show{
                color: #3190e8;
                border-color: #3190e8;
            }
        }
    }
    .food_container{
        display: flex;
        flex: 1;
        padding-bottom: 2rem;
    }
    .menu_container{
        display: flex;
        flex: 1;
        overflow-y: hidden;
        position: relative;
        .menu_left{
            ovweflow-y: auto;
            width: 3.8rem;
            .menu_left_li{
                padding: 0.7rem 0.3rem;
                border-bottom: 0.025rem solid #ededed;
                box-sizing: border-box;
                border-left: 0.15rem solid #f8f8f8;
                position: relative;
                img{
                    @include wh(0.5rem, 0.6rem);
                }
                span{
                    @include sc(0.6rem, #666);
                }
                .category_num{
                    position: absolute;
                    top: 0.1rem;
                    right: 0.1rem;
                    background-color: #ff461d;
                    line-height: 0.6rem;
                    text-aligin: center;
                    border-radius: 50%;
                    border: 0.025rem solid #ff461d;
                    min-height: 0.6rem;
                    height: 0.6rem;
                    @include sc(0.5rem, #fff);
                    font-family: Helvetica Neue,Tahoma,Arial;
                }
            }
            .activity_menu{
                border-left: 0.15rem solid #3190e8;
                background-color: #fff;
                span:nth-of-type(1){
                    font-weight: bold;
                }
            }
        }
        .menu_right{
            flex: 4;
            overflow-y: auto;
            .menu_detail_header{
                width: 100%;
                padding: 0.4rem;
                position: relative;
                @include fj;
                align-items: center;
                .menu_detail_header_left{
                    width: 11rem;
                    white-space: nowrap;
                    overflow: hidden;
                    .menu_item_title{
                        @include sc(.7rem, #666);
                        font-weight: bold;
                    }
                    .menu_item_description{
                        @include sc(.5rem, #999);
                        width: 30%;
                        overflow: hidden;
                    }
                }
                .menu_detail_header_right{
                    @include wh(0.5rem, 1rem);
                    display: block;
                    @include bis('../../images/icon_point.png');
                    background-size: 100% 0.4rem;
                    background-position: left center;
                }
                .description_tip{
                    background-color: #39373a;
                    opacity: 0.95;
                    @include sc(0.5rem, #fff);
                    position: absolute;
                    top: 1.5rem;
                    z-index: 14;
                    width: 8rem;
                    right: 0.2rem;
                    padding: 0.5rem 0.4rem;
                    border: 1px;
                    border-radius: 0.2rem;
                    span{
                        color: #fff;
                        line-height: 0.6rem;
                        font-size: 0.55rem;
                    }
                }
                .description_tip::after{
                    content: '';
                    position: absolute;
                    @include wh(0.4rem, 0.4rem);
                    background-color: #39373a;
                    top: -0.5rem;
                    right: 0.7rem;
                    transfrom: rotate(-45deg) translateY(0.41rem);
                }
            }
            .menu_detail_list{
                background-color: #fff;
                padding: 0.6rem 0.4rem;
                border-bottom: 1px solid #f8f8f8;
                position: relative;
                overflow: hidden;
                .menu_detail_link{
                    display: flex;
                    .menu_food_img{
                        margin-right: 0.4rem;
                        img{
                            @include wh(2rem, 2rem);
                            display: block;
                        }
                    }
                    .menu_food_description{
                        width: 100%;
                        .food_description_head{
                            @include fj;
                            margin-bottom: 0.2rem;
                            .description_foodname{
                                @include sc(0.7rem, #333);
                            }
                            .attributes_ul{
                                display: flex;
                                li{
                                    font-size: 0.3rem;
                                    height: 0.6rem;
                                    line-height: 0.35rem;
                                    padding: 0.1rem;
                                    border: 1px solid #666;
                                    border-radius: 0.3rem;
                                    margin-right: 0.1rem;
                                    transfrom: scale(0.8);
                                    p{
                                        white-space: nowrap;
                                    }
                                }
                                .attribute_new{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    background-color: #4cd964;
                                    @include wh(2rem, 2rem);
                                    display: flex;
                                    align-items: flex-end;
                                    transform: rotate(-45deg) translate(-0.1rem, -1.5rem);
                                    border: none;
                                    border-radius: 0;
                                    p{
                                        @include sc(0.4rem, #fff);
                                        text-align: center;
                                        flex: 1;
                                    }
                                }
                            }
                        }
                        .food_description_content{
                            @include sc(.5rem, #999);
                            line-height: .6rem;
                        }
                        .food_description_sale_rating{
                            line-height: .8rem;
                            span{
                                @include sc(.5rem, #333);
                            }
                        }
                        .food_activity{
                            line-height: .4rem;
                            span{
                                font-size: .3rem;
                                border: 1px solid currentColor;
                                border-radius: 0.3rem;
                                padding: .08rem;
                                display: inline-block;
                                transform: scale(.8);
                                margin-left: -0.35rem;
                            }
                        }
                    }
                }
                .menu_detail_footer{
                    margin-left: 2.4rem;
                    font-size: 0;
                    margin-top: 0.3rem;
                    @include fj;
                    .food_price{
                        span{
                            font-family: 'Helvetica Neue',Tahoma,Arial;
                        }
                        span:nth-of-type(1){
                            @include sc(0.5rem, #f60);
                            margin-right: 0.05rem;
                        }
                        span:nth-of-type(2){
                            @include sc(0.7rem, #f60);
                            font-weight: bold;
                            margin-right: 0.3rem;
                        }
                        span:nth-of-type(3){
                            @include sc(0.5rem, #666);
                        }
                    }
                }
            }
        }    
    }
    .buy_cart_container{
        position: absolute;
        background-color: #3d3d3f;
        bottom: 0;
        left: 0;
        z-index: 13;
        display: flex;
        @include wh(100%, 2rem);
        .cart_icon_num{
            flex: 1;
            .cart_icon_container{
                display: flex;
                background-color: #3d3d3f;
                position: absolute;
                padding: 0.4rem;
                border: 0.18rem solid #444;
                border-radius: 50%;
                left: 0.5rem;
                top: -0.7rem;
                .cart_icon{
                    @include wh(1.2rem, 1.2rem);
                }
                .cart_list_length{
                    position: absolute;
                    top: -0.25rem;
                    right: -0.25rem;
                    background-color: #ff461d;
                    line-height: 0.7rem;
                    text-align: center;
                    border-radius: 50%;
                    border: 0.025rem solid #ff461d;
                    min-height: 0.7rem;
                    height: 0.7rem;
                    @include sc(0.5rem, #fff);
                    font-family: Helvetica Neue, Tahoma, Arial;
                }
            }
            .move_in_cart{
                animation: mymove 0.5s ease-in-out;
            }
            .cart_icon_activity{
                background-color: #3190e8;
            }
            .cart_num{
                @include ct;
                left: 3.5rem;
                div{
                    color: #fff;
                }
                div:nth-of-type(1){
                    font-size: 0.8rem;
                    font-weight: bold;
                    margin-bottom: 0.1rem;
                }
                div:nth-of-type(2){
                    font-size: 0.4rem;
                }
            }
        }
    }
</style>