
let app = getApp();
let utils = require('../../utils/util');

//获取应用实例
Page({
    data: {
        indicatorDots: true,//是否显示面板指示点
        autoPlay: true,//自动播放
        interVal: 5000,//自动切换时间间隔
        duration: 500,//滑动动画时长
        indicatorColor: 'rgba(0, 0, 0, 0.5)',//指示点颜色
        indicatorActiveColor: 'rgba(255, 255, 255, 0.8)',//	当前选中的指示点颜色
        circular: true,//是否采用衔接滑动
        vertical: false,//滑动方向是否为纵向
        bannerList:[], //轮播图数据

        menuShow:false, // 菜单显隐

        gcList:[],// 国产
        rhList:[],// 日韩
        omList:[],// 欧美
    },
    // 轮播事件
    changeIndicatorDots(e) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        })
    },
    changeAutoplay(e) {
        this.setData({
            autoPlay: !this.data.autoPlay
        })
    },
    intervalChange(e) {
        this.setData({
            interval: e.detail.value
        })
    },
    durationChange(e) {
        this.setData({
            duration: e.detail.value
        })
    },
    onShow() {
        let $this = this;
        let bannerUrl = 'http://api.bilibili.com/x/web-show/res/loc?jsonp=jsonp&pf=0&id=23&_=1482805801599';//轮播数据
        let api = 'https://api.imjad.cn/bilibili/';
        wx.request({
            url: bannerUrl,
            data:{
                jsonp:1482805801599,
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                $this.setData({
                    bannerList:res.data.data
                });
                console.log(res.data.data)
            }
        });

        wx.request({
            url: api,
            data:{
                get:'rank',
                content:5,
                duration:3
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                $this.setData({
                    gcList:res.data.rank.list
                });
            }
        });

        wx.request({
            url: api,
            data:{
                get:'rank',
                content:23,
                duration:3
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                $this.setData({
                    rhList:res.data.rank.list
                });
            }
        });

        wx.request({
            url: api,
            data:{
                get:'rank',
                content:119,
                duration:3
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                $this.setData({
                    omList:res.data.rank.list
                });
            }
        });

    },
    // 菜单开关
    menuSwitch() {
        this.setData({
            menuShow:!this.data.menuShow
        });
    },

});

