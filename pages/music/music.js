let app = getApp();
let utils = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      api:'https://api.imjad.cn/cloudmusic/',
      musicList:[],
      onePlay:true, //是否第一次来 用于控制来列表不点播放进详情再点播放的操作
      player:{

          playId:-1, //正在播放的歌曲下标id

          mid:'',// 正在播放的音乐id
          isPlay:false,// 是否显示播放器
          playSwitch:false, // 是否在播放
          title:'歌名',
          epname:'专辑名',
          singer:'歌手',
          src:'',
          coverImgUrl:'http://idsolo.com/upload/qtz/morenfengmian.png',
          lrc:[],
          lrcI:0,
          lrcH:'',
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      let $this = this;
      let ml_id = 372554249; //歌单id

      // 歌单信息
      wx.request({
          url: $this.data.api,
          data:{
              type:'playlist',
              id:ml_id,
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
              $this.setData({
                  musicList:res.data.playlist
              });
          }
      });

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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
      // 播放结束 自动下一首
      let $this = this,
          playId ='player.playId',
          isPlay = 'player.isPlay',
          mid = 'player.mid',
          src = 'player.src',
          title = 'player.title',
          epname = 'player.epname',
          singer = 'player.singer',
          coverImgUrl = 'player.coverImgUrl',
          playSwitch = 'player.playSwitch';

      app.backgroundAudioManager.onEnded(function () {

          let i = $this.data.player.playId+1;
          let address = $this.data.musicList.tracks;

          if(i<=address.length){ // 如果当前播放为最后一首了 则停止

              $this.setData({
                  [playId]:$this.data.playId+1,
                  [isPlay]: true,
                  [mid]: address[i].id,
                  [singer]:address[i].ar[0].name,
                  [title]:address[i].name,
                  [epname]:address[i].al.name,
                  [coverImgUrl]:address[i].al.picUrl,
              });

              wx.request({
                  url: $this.data.api,
                  data:{
                      type:'song',
                      id:$this.data.player.mid,
                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  success: function(res) {
                      $this.setData({
                          [src]:res.data.data[0].url,
                          [playSwitch]:true,
                      });

                      $this.playMusic();

                  }
              });
          }


      });



      var query = wx.createSelectorQuery()
      query.select('#main').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res){
          console.log(res)
      })

  },
  //播放全部
  playerAll(){
      let $this = this,
          isPlay = 'player.isPlay',
          mid = 'player.mid',
          src = 'player.src',
          title = 'player.title',
          epname = 'player.epname',
          singer = 'player.singer',
          coverImgUrl = 'player.coverImgUrl',
          playSwitch = 'player.playSwitch',

          i=0,
          address = $this.data.musicList.tracks;

      if(i<=address.length){ // 如果当前播放为最后一首了 则停止

          $this.setData({
              [playId]:0,
              [isPlay]: true,
              [mid]: address[0].id,
              [singer]:address[0].ar[0].name,
              [title]:address[0].name,
              [epname]:address[0].al.name,
              [coverImgUrl]:address[0].al.picUrl,
          });

          wx.request({
              url: $this.data.api,
              data:{
                  type:'song',
                  id:$this.data.player.mid,
              },
              header: {
                  'content-type': 'application/json'
              },
              success: function(res) {
                  $this.setData({
                      [src]:res.data.data[0].url,
                      [playSwitch]:true,
                  });

                  $this.playMusic();
              }
          });

      }

  },

  // 点击音乐列表
  clickMusic(e){

      let $this = this,
          playId = 'player.playId',
          isPlay = 'player.isPlay',
          mid = 'player.mid',
          src = 'player.src',
          title = 'player.title',
          epname = 'player.epname',
          singer = 'player.singer',
          coverImgUrl = 'player.coverImgUrl',
          playSwitch = 'player.playSwitch',
          dataset = e.currentTarget.dataset;

      this.setData({
          onePlay:false,

          [playId]:dataset.id,
          [isPlay]: true,
          [mid]: dataset.mid,
          [singer]:dataset.singer,
          [title]:dataset.title,
          [epname]:dataset.epname,
          [coverImgUrl]:dataset.pic
      });

      wx.request({
          url: $this.data.api,
          data:{
              type:'song',
              id:$this.data.player.mid,
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
              $this.setData({
                  [src]:res.data.data[0].url,
                  [playSwitch]:true,
              });

              $this.playMusic();


          }
      });


      console.log($this.data.player.playId)
  },
  // 播放开关
  playSwitch(){
      let $this =this;
      let playSwitch = 'player.playSwitch';


      if ($this.data.onePlay==true){
          $this.playMusic();

          $this.setData({
              onePlay:false,
              [playSwitch]:true,
          });

      }else {

          $this.setData({
              [playSwitch]:!this.data.player.playSwitch,
          });

          if($this.data.player.playSwitch==false){
              app.backgroundAudioManager.pause();
          }else {
              $this.playMusic();
              app.backgroundAudioManager.play();
          };
      }
      console.log($this.data.player.playSwitch)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      let $this = this;

      let player = wx.getStorageSync('player');
      let onePlay = wx.getStorageSync('onePlay');

      this.setData({
          player:player,
          onePlay:onePlay,
      });

      // 读取之前最后听的歌曲
      if ($this.data.onePlay==false && $this.data.onePlay.playSwitch==true){
          let playSwitch ='player.playSwitch';

          $this.setData({
              [playSwitch]:false,
          });
      }

      console.log(onePlay);


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

      // 缓存当前播放的数据
      wx.setStorageSync('player', this.data.player);
      wx.setStorageSync('musicList', this.data.musicList);
      wx.setStorageSync('onePlay', this.data.onePlay);

     },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});