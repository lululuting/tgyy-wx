let app = getApp();
let utils = require('../../utils/util');

Page({
    onReady: function (res) {
        this.videoContext = wx.createVideoContext('myVideo')
    },
    inputValue: '',
    data: {
        loadPlay:true, //等待加载播放
        videoTime:'00:00',//时长
        aid:'',
        src: '',//  播放地址
        infoData:[], //视频信息
        videoCorrelation:[],//视频信息里面的视频相关
        commentsData:[], // 评论数据20条
        commentsCount:0, // 评论数据条数
        openInfo:false,//是否打开下拉介绍详情
        infoHeight:40,// infobox默认高度
    },
    onShow(){
        let $this = this;
        let api = 'https://api.imjad.cn/bilibili/v2/';

        // 视频连接
        wx.request({
            url: api,
            data:{
                aid:$this.data.aid,
                page:1,
                quality:3,
                type:'mp4',
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                $this.setData({
                    videoTime:res.data.timelength
                });

                if (res.data.durl instanceof Array){
                    $this.setData({
                        src:res.data.durl.backup_url.url
                    });
                }else {
                    $this.setData({
                        src:res.data.durl.url
                    });
                }
            }
        });

        // 视频信息
        wx.request({
            url: api,
            data:{
                aid:$this.data.aid,
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                $this.setData({
                    infoData:res.data.data,
                    videoCorrelation:res.data.data.relates
                });

                // 改变title
                wx.setNavigationBarTitle({title:$this.data.infoData.title})
            },
        });

        // 评论信息 按点赞最多来排 20条排6条
        wx.request({
            url: api,
            data:{
                get:'comments',
                aid:$this.data.aid,
                sort:2
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                $this.setData({
                    commentsData:res.data.data.replies,
                    commentsCount:res.data.data.page.count,
                });
            },
        });


    },
    onLoad(options) {
        this.videoContext = wx.createVideoContext('myVideo');

        this.setData({
            aid: options.aid
        });


        // 播放器页 音乐要关闭
        app.backgroundAudioManager.stop();
    },
    clickLoadPlay(){
        this.videoContext.play();

        this.setData({
            loadPlay:false,
        });
    },
    // 下拉动画
    openInfo(){
        let $this = this;
        wx.createSelectorQuery().select('.info').boundingClientRect(function(rect){
            let infoHeight = rect.height*2;// 节点的高度
            $this.setData({
                openInfo:!$this.data.openInfo,
                infoHeight:infoHeight+80,
            });
        }).exec();
    },
});