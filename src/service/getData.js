import axios from 'axios'

// 获取当前城市
export const guessCity = () => {
    return axios.get('/v1/cities?type=guess')
}


// 获取热门城市
export const hotCity = () => {
    return axios.get('/v1/cities?type=hot')
}

// 获取所有城市
export const groupCity = () => {
    return axios.get('/v1/cities?type=group')
}

// 获取当前城市信息
export const currentCity = cityid => {
    return axios.get('/v1/cities/' + cityid)
}

// 搜索地址
export const searchPlace = (cityid, value) => {
    return axios.get('/v1/pois?type=search&city_id=' + cityid + '&keyword=' + value)
}

// 获取msite页面地址信息

export const msiteAddress = geohash => {
    return axios.get('/v2/pois/' + geohash);
}


// 获取商品导航列表
export const msiteFoodTypes = geohash => {
    return axios.get('/v2/index_entry?geohash=' + geohash + '&group_type=1&flags[]=F');
}


// 获取商家列表
export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', delivery_mode = '', support_ids = []) => {
    let supportStr = '';
    support_ids.forEach(item => {
        if (item.status) {
            supportStr += '&support_ids[]=' + item.id;
        }
    });

    let data =  'latitude=' + latitude + 
                '&longitude=' + longitude +
                '&offset=' + offset +
                '&limit=20' +
                '&extras[]=' + 'activities'
                '&keyword='+
                '&restaurant_category_id=' + restaurant_category_id,
                '&restaurant_category_ids[]' + restaurant_category_ids,
                '&order_by=' + 
                '&delivery_mode[]=' + delivery_mode + supportStr;  
    return axios.get('/shopping/restaurants?' + data);
}

// 获取商家详情
export const shopDetails = (shopid, latitude, longitude) => {
    let data =  '?latitude=' + latitude +
                '&longitude=' + longitude +
                '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics';
    return axios.get('/shopping/restaurant/' + shopid + data);
}

// 获取商家菜单
export const foodMenu = shopid => {
    return axios.get('/shopping/v2/menu?restaurant_id=' + shopid);
}