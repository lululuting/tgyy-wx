let app = getApp();
let utils = require('../../utils/util');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        api:'https://api.imjad.cn/cloudmusic/',

        musicList:[], // 缓存中音乐列表数据
        player:[], //缓存中正在播放的音乐数据

        onePlay:true,// 缓存中正是否第一次来数据
        lrcSwitch:false, // 封面歌词切换变量

        duration:'00:00', // 时长
        currentTime:'00:00', // 播放时间进度
        progress:0,// 进度条数值宽

        progressWidth:0,// 进度条总宽
        playTimeWidth:0,// 播放时间view的宽
        lrcItemHeight:0,// 某行歌词的高
    },
    // 播放音乐函数
    playMusic(){
        app.backgroundAudioManager.src = this.data.player.src;
        app.backgroundAudioManager.title = this.data.player.title;
        app.backgroundAudioManager.epname = this.data.player.epname;
        app.backgroundAudioManager.singer = this.data.player.singer;
        app.backgroundAudioManager.coverImgUrl = this.data.player.coverImgUrl;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        let $this = this;
        let player = wx.getStorageSync('player');
        let onePlay = wx.getStorageSync('onePlay');
        let musicList = wx.getStorageSync('musicList');


        let musicDuration = utils.formatMusicDuration(app.backgroundAudioManager.duration);

        this.setData({
            player: player,
            onePlay: onePlay,
            musicList:musicList,
            duration: musicDuration,
        });


        // 查询播放时间view两边的width
        wx.createSelectorQuery().select('.play_time').boundingClientRect(function (rect) {
            $this.setData({
                playTimeWidth: rect.width,   // 节点的宽度
            })
        }).exec();

        // 查询进度条的width
        wx.createSelectorQuery().select('.progress').boundingClientRect(function (rect) {
            $this.setData({
                progressWidth: rect.width,   // 节点的宽度
            })
        }).exec();

        // 查询某条歌词的height 80rpx在不同机型上的px大小 这里用查询按钮的80rpx代替
        wx.createSelectorQuery().select('.player_btn').boundingClientRect(function(rect){
            $this.setData({
                lrcItemHeight: rect.height,   // 节点的宽度
            });
        }).exec();


        // 获取歌词
        wx.request({
            url: $this.data.api,
            data:{
                type:'lyric',
                id:$this.data.player.mid,
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let lrc = 'player.lrc';
                if(res.data.nolyric){
                    $this.setData({
                        [lrc]:'2',//纯音乐
                    });
                }else if (res.data.uncollected){
                    $this.setData({
                        [lrc]:'3',//没歌词
                    });
                }else {
                    let obj = [];// 先要变回obj 不然切歌无歌词的时候是前面的字符串格式
                    let lrcList = utils.createLrc(res.data.lrc.lyric,obj);//调用main.js挂在vue上解析歌词的方法

                    $this.setData({
                        [lrc]:lrcList,
                    });
                }
            }
        });
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady () {
        // 播放结束 自动下一首
        let $this = this,
            playId = 'player.isPlay',
            isPlay = 'player.isPlay',
            mid = 'player.mid',
            src = 'player.src',
            title = 'player.title',
            epname = 'player.epname',
            singer = 'player.singer',
            coverImgUrl = 'player.coverImgUrl',
            playSwitch = 'player.playSwitch',
            lrcI = 'player.lrcI',
            lrcH = 'player.lrcH';

        console.log(this.data.player);
        app.backgroundAudioManager.onEnded(function () {

            let i = $this.data.playId + 1;
            let address = $this.data.musicList.tracks;

            if (i <= address.length) { // 如果当前播放为最后一首了 则停止

                $this.setData({
                    [playId]: $this.data.player.playId + 1,
                    [isPlay]: true,
                    [mid]: address[i].id,
                    [singer]: address[i].ar[0].name,
                    [title]: address[i].name,
                    [epname]: address[i].al.name,
                    [coverImgUrl]: address[i].al.picUrl,
                });

                wx.request({
                    url: $this.data.api,
                    data: {
                        type: 'song',
                        id: $this.data.player.mid,
                    },
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (res) {
                        $this.setData({
                            [src]: res.data.data[0].url,
                            [playSwitch]: true,
                        });

                        $this.playMusic();
                    }
                });
            }
        });


        // 监听播放
        app.backgroundAudioManager.onTimeUpdate(function () {
            let $width = Math.round($this.data.progressWidth/app.backgroundAudioManager.duration*app.backgroundAudioManager.currentTime);
            let currentTime = app.backgroundAudioManager.currentTime.toFixed(2);

            $this.setData({
                progress:$width,
                currentTime:utils.formatMusicDuration(app.backgroundAudioManager.currentTime),
            });

            if ($this.data.player.lrc!=='2' && $this.data.player.lrc!=='3'){
                for (let i =0;i<$this.data.player.lrc.length;i++){

                    if(parseFloat($this.data.player.lrc[i].time)<=currentTime && currentTime<= parseFloat($this.data.player.lrc[i +1].time)){

                        let lrcBoxH = i*$this.data.lrcItemHeight;
                        $this.setData({
                            [lrcI]:i,
                            [lrcH]:lrcBoxH,
                        });

                    }
                }
            }
        })

    },

    // 播放开关
    playSwitch(){

        let $this = this;
        let playSwitch = 'player.playSwitch';

        if ($this.data.onePlay==true){

            $this.setData({
                onePlay:false,
                [playSwitch]:true,
            });

            $this.playMusic();
        } else{
            this.setData({
                [playSwitch]:!this.data.player.playSwitch,
            });

            if($this.data.player.playSwitch==false){
                app.backgroundAudioManager.pause();
            }else {
                $this.playMusic();
                app.backgroundAudioManager.play();
            }
        }
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {
        // 缓存当前播放的数据
        wx.setStorageSync('player', this.data.player);

    },

    // 封面歌词切换
    lrcSwitch(){
        this.setData({
            lrcSwitch:!this.data.lrcSwitch,
        });
    },
    // 进度条触摸
    progressTouch(e){
        let x = e.touches[0].pageX-this.data.playTimeWidth;
        if (x<=0){
            x=0;
        }else if(x>=this.data.progressWidth){
           x= this.data.progressWidth;
        }

        this.setData({
            progress:x,
        });

        // 更新播放时间
        app.backgroundAudioManager.seek(app.backgroundAudioManager.duration/(this.data.progressWidth/x));
    }

});