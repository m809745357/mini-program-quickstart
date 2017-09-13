//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    oauth: {},
    hasOauth: false,
    canIUse: false,
    bg: '/assert/images/bg.png',
    bgTop: '/assert/images/bg-top.png',
    aboutas: '/assert/icon/aboutas.png',
    aboutason: '/assert/icon/aboutas-on.png',
    product: '/assert/icon/product.png',
    producton: '/assert/icon/product-on.png',
    contact: '加载中'
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })

    if (app.globalData.oauth) {
      this.setData({
        oauth: app.globalData.oauth,
        hasOauth: true
      })
    } else {
      app.getAccessTokenReadyCallback = res => {
        this.setData({
          oauth: res.data,
          hasOauth: true
        })
      }
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function () {
    this.intervalUpdateUser = setInterval(this.updateUser, 500);
  },
  updateUser: function () {
    let that = this
    if (this.data.hasOauth) {
      clearInterval(this.intervalUpdateUser)
      wx.request({
        url: `${app.globalData.host}${app.globalData.version}/user`,
        method: 'PUT',
        data: {
          nickname: this.data.userInfo.nickName,
          avatar: this.data.userInfo.avatarUrl,
          gender: this.data.userInfo.gender
        },
        header: {
          'Authorization': `${this.data.oauth.token_type} ${this.data.oauth.access_token}`
        },
        success: function (res) {

        }
      })

      wx.request({
        url: `${app.globalData.host}${app.globalData.version}/product/1`,
        header: {
          'Authorization': `${this.data.oauth.token_type} ${this.data.oauth.access_token}`
        },
        success: function (res) {
          that.setData({
            bgTop: `${app.globalData.host}/${app.globalData.uploads}/${res.data.images}`,
            contact: res.data.contact
          })

          wx.hideLoading()
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tapToProducts: function (e) {
    wx.navigateTo({
      url: '/pages/product/product'
    })
  }
})
