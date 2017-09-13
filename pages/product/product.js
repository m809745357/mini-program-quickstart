const app = getApp()

Page({
  data: {
    oauth: {},
    hasOauth: false,
    bg: '/assert/images/bg.png',
    bgTop: '/assert/images/bg-top.png',
    aboutas: '/assert/icon/aboutas.png',
    aboutason: '/assert/icon/aboutas-on.png',
    product: '/assert/icon/product.png',
    producton: '/assert/icon/product-on.png',
    products: [
      {
        id: 1,
        image: '/assert/images/product.png',
        title: '加载中',
        contact: '',
        click: false,
      }
    ]
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
  },
  onShow: function () {
    this.intervalGetProduct = setInterval(this.getProduct, 500);
  },
  getProduct: function () {
    let that = this
    if (this.data.hasOauth) {
      clearInterval(this.intervalGetProduct)
      wx.request({
        url: `${app.globalData.host}${app.globalData.version}/product`,
        header: {
          'Authorization': `${this.data.oauth.token_type} ${this.data.oauth.access_token}`
        },
        success: function (res) {
          console.log(res.data);
          let products = res.data.map(function (item, index) {
            item.click = false
            item.image = `${app.globalData.host}/${app.globalData.uploads}/${item.images}`
            return item;
          })
          that.setData({
            products: products
          })
          wx.hideLoading()
        }
      })
    }
  },
  tapLook: function (e) {
    console.log(e.target.dataset.id);
    let index = e.target.dataset.id;
    let products = this.data.products;
    products[index].click = true;
    this.setData({
      products: products
    });
  },
  tapUnLook: function (e) {
    let index = e.target.dataset.id;
    let products = this.data.products;
    products[index].click = false;
    this.setData({
      products: products
    });
  },
  tapToAboutAs: function (e) {
    wx.navigateBack({
      url: '/pages/index/index'
    })
  }
})
