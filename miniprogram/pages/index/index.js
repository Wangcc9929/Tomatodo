const app= getApp()
const untils = require('../../untils/untils.js')
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 20,
    mTime: 1200000,
    timeStr: "",
    thingsActive: 0,
    clockShow: false,
    clockHeight: 0,
    rate: 0,
    timer: null,
    returnShow: false,
    pauseShow: true,
    conAndAbanShow: false,
    thingsArr: [
      { icon: "work", text: "工作" },
      { icon: "study", text: "学习" },
      { icon: "think", text: "思考" },
      { icon: "write", text: "写作" },
      { icon: "sport", text: "运动" },
      { icon: "read", text: "阅读" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync();
    var rate = 750 / res.windowWidth;
    this.setData({
      rate: rate,
      clockHeight: rate * res.windowHeight,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  getUserInfo: function (e) {
    var user = wx.getStorageSync('user')
    app.globalData.userInfo = user.userInfo
    this.setData({
      userInfo: user.userInfo,
      hasUserInfo: true
    })
  },
  sliderChange: function (e) {
    this.setData({
      time: e.detail.value,
    })
  },
  clickThings: function (e) {
    this.setData({
      thingsActive: e.currentTarget.dataset.index,
    })
  },
  start: function () {
    var user = wx.getStorageSync('user')
    if (!user) {
      wx.showModal({
        title: '温馨提示',
        content: '登录才能进行计时',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/me/me'
            })
          } else if (res.cancel) {
          }
        }
      })
    } else {
      this.setData({
        clockShow: true,
        mTime: this.data.time * 60 * 1000,
        timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ":00",
      });
      this.drawActive();
    }

  },
  drawActive: function () {
    var self = this;
    this.data.timer = setInterval(function () {
      var angle = 1.5 + 2 * (self.data.time * 60 * 1000 - self.data.mTime) / (self.data.time * 60 * 1000);
      var currentTime = self.data.mTime - 100;
      self.setData({
        mTime: currentTime,
      })
      if (angle < 3.5) {
        if (currentTime % 1000 == 0) {
          var timeStr1 = currentTime / 1000; // s
          var timeStr2 = parseInt(timeStr1 / 60) // m
          var timeStr3 = (timeStr1 - timeStr2 * 60) >= 10 ? (timeStr1 - timeStr2 * 60) : '0' + (timeStr1 - timeStr2 * 60);
          var timeStr2 = timeStr2 >= 10 ? timeStr2 : '0' + timeStr2;
          self.setData({
            timeStr: timeStr2 + ':' + timeStr3
          })
        }
        var lineWidth = 6 / self.data.rate;
        var ctx = wx.createCanvasContext("progress_active");
        ctx.setLineWidth(lineWidth);
        ctx.setStrokeStyle("#ffffff");
        ctx.setLineCap("round");
        ctx.beginPath();
        ctx.arc(400 / self.data.rate / 2, 400 / self.data.rate / 2, 400 / self.data.rate / 2 - lineWidth, angle * Math.PI, 3.5 * Math.PI, false);
        ctx.stroke();
        ctx.draw();
      }
      else {
        clearInterval(self.data.timer);
        self.setData({
          pauseShow: false,
          conAndAbanShow: false,
          returnShow: true,
        });
        db.collection("count").add({
          data: {
            date: untils.formatTime(new Date),
            things: self.data.thingsActive,
            time: self.data.time,
            openid: app.globalData.openid
          }
        })
        // wx.cloud.callFunction({
        //   name: "createcount",
        //   data: {
        //     date: untils.formatTime(new Date),
        //     things: self.data.thingsActive,
        //     time: self.data.time,
        //     openid: app.globalData.openid
        //   }
        // })
        // var count = wx.getStorageSync("count") || [];
        // count.unshift({
        //   date: untils.formatTime(new Date),
        //   things: self.data.thingsActive,
        //   time: self.data.time,
        // });
        // wx.setStorageSync("count", count);
      }

    }, 100)
  },
  pause() {
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: false,
      conAndAbanShow: true,
    });
  },
  continued() {
    this.drawActive();
    this.setData({
      pauseShow: true,
      conAndAbanShow: false,
    });
  },
  returned() {
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: true,
      returnShow: false,
      conAndAbanShow: false,
      clockShow: false,
    });
  },
  abandon() {
    var self = this;
    wx.showModal({
      title: '温馨提示',
      content: '您真的要放弃吗？不再坚持一下了吗？',
      success(res) {
        if (res.confirm) {
          clearInterval(self.data.timer);
          self.setData({
            pauseShow: true,
            returnShow: false,
            conAndAbanShow: false,
            clockShow: false,
          });
        } else if (res.cancel) {
        }
      }
    })
  },
})