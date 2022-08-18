const untils = require('../../untils/untils.js')
const db = wx.cloud.database()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs: [],
    activeIndex: 0,
    dayList: [],
    list: [],
    count:[],
    sum: [
      {
        title: '今日番茄次数',
        val: '0'
      },
      {
        title: '累计番茄次数',
        val: '0'
      },
      {
        title: '今日专注时长',
        val: '0分钟'
      },
      {
        title: '累计专注时长',
        val: '0分钟'
      }
    ],
    thingsArr: [
      {
        icon: 'work',
        text: '工作'
      },
      {
        icon: 'study',
        text: "学习",
      },
      {
        icon: 'think',
        text: '思考'
      },
      {
        icon: 'write',
        text: '写作'
      },
      {
        icon: 'sport',
        text: '运动'
      },
      {
        icon: 'read',
        text: "阅读"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var user = wx.getStorageSync('user');
    var self=this;
    if (!user) {
      wx.showModal({
        title: '温馨提示',
        content: '登录才可查看统计',
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
      db.collection("count").where({
        openid: app.globalData.openid,
      }).get({
        success(res){
          self.setData({
            count:res.data,
          });
          var day = 0;
          var total = self.data.count.length;
          var dayTime = 0;
          var totalTime = 0;
          var dayList = [];
          for (var i = 0; i < self.data.count.length; i++) {
            if (self.data.count[i].date.substr(0, 10) == untils.formatTime(new Date).substr(0, 10)) {
              day = day + 1;
              dayTime = dayTime + parseInt(self.data.count[i].time);
              dayList.push(self.data.count[i]);
              self.setData({
                dayList: dayList,
                list: dayList
              })
            }
            totalTime = totalTime + parseInt(self.data.count[i].time)
          }
          self.setData({
            'sum[0].val': day,
            'sum[1].val': total,
            'sum[2].val': dayTime + '分钟',
            'sum[3].val': totalTime + '分钟'
          })
        }
      })
      // var count = wx.getStorageSync("count") || [];
    }
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

  },
  changeType(e) {
    var index = e.currentTarget.dataset.index;
    var self=this;
    if (index == 0) {
      this.setData({
        list: this.data.dayList,
        activeIndex: index,
      })
    } else if (index == 1) {
      this.setData({
        list: self.data.count,
        activeIndex: index,
      })
    }

  }
})