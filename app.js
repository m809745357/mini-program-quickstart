//app.js
App({
  onLaunch: function () {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: `${this.globalData.host}${this.globalData.version}/register`,
          data: { code: res.code },
          method: 'POST',
          dataType: 'json',
          success: res => {
            if (this.registerReadyCallback) {
              this.registerReadyCallback(res)
            }
          }
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    this.registerReadyCallback = res => {
      let { openid } = res.data
      wx.request({
        url: `${this.globalData.host}/oauth/token`,
        data: {
          grant_type: 'password',
          client_id: this.globalData.client_id,
          client_secret: this.globalData.client_secret, // 6lCclMCZW8GDbTA2XETZ6AwyM1EeL64gQpk9luju
          username: openid,
          password: this.globalData.password,
          scope: '*'
        },
        method: 'POST',
        success: res => {
          this.globalData.oauth = res.data

          if (this.getAccessTokenReadyCallback) {
            this.getAccessTokenReadyCallback(res)
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    host: 'https://kaida.mandokg.com',
    version: '/api/v1',
    uploads: 'uploads',
    accessToken: '',
    tokenType: '',
    client_id: '2',
    client_secret: 'xuZEEhLH7UffCfhGZof6kETC98FzmFopb8BIOWri',
    password: 'huishuoit',
    oauth: ''
  }
})
