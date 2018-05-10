### vue_elm
这是用vue.js做的一个仿饿了么前端项目，打包工具是webpack，数据来源调用的是苍渡大神的数据接口。

### 项目技术
* html5+css3和css预处理技术sass
* vue.js+vuex+axios
* better-scroll插件来实现列表滑动

### 跨域处理
在config文件夹下的index.js文件增加proxyTable，如：<br>
``` js
proxyTable: {
  '/v1': {
    target: 'http://cangdu.org:8001',
    changeOrigin: true
  },
  '/v2': {
    target: 'http://cangdu.org:8001',
    changeOrigin: true
  }
}

### 界面展示
![](https://github.com/Liyuan9/vue_elm/raw/master/screenimg/address.png)
