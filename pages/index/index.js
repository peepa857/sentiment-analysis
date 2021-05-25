// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    analysisText: "",
    sentiment: "中性",
    percent: "50",
    warnToast: false,
    hideWarnToast: false,
    errorMsg: "错误提示",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    canIUseGetUserProfile: false,
    canIUseOpenData:
      wx.canIUse("open-data.type.userAvatarUrl") &&
      wx.canIUse("open-data.type.userNickName"), // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: "../logs/logs",
    });
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
    });
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
  bindinput: function (e) {
    this.setData({
      analysisText: e.detail.value,
    });
  },
  btnClick: function () {
    var analysisText = this.data.analysisText;
    var that = this;
    const sentimentsObj = {
      0: "负向",
      1: "中性",
      2: "正向",
    };
    const accessToken = "XXXXXX"; // api token
    if (analysisText != null && analysisText != "") {
      wx.showLoading({
        title: "加载中",
      });
      wx.request({
        url:
          "https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify?charset=UTF-8&access_token=" +
          accessToken,
        method: "POST",
        data: {
          text: analysisText,
        },
        header: {
          "content-type": "application/json",
        },
        success(res) {
          console.log(res.data);
          wx.hideLoading();
          if (res.data.items) {
            that.setData({
              sentiment: sentimentsObj[res.data.items[0].sentiment],
              percent: String(
                Math.round(res.data.items[0].positive_prob * 100)
              ),
            });
          } else {
            that.setData({
              warnToast: true,
              errorMsg: "分析失败，请重试",
            });
            setTimeout(() => {
              that.setData({
                hidewarnToast: true,
              });
              setTimeout(() => {
                that.setData({
                  warnToast: false,
                  hidewarnToast: false,
                });
              }, 300);
            }, 3000);
          }
        },
        fail() {
          wx.hideLoading();
          that.setData({
            warnToast: true,
            errorMsg: "分析失败",
          });
          setTimeout(() => {
            that.setData({
              hidewarnToast: true,
            });
            setTimeout(() => {
              that.setData({
                warnToast: false,
                hidewarnToast: false,
              });
            }, 300);
          }, 3000);
        },
      });
    } else {
      that.setData({
        warnToast: true,
        errorMsg: "请输入内容",
      });
      setTimeout(() => {
        that.setData({
          hidewarnToast: true,
        });
        setTimeout(() => {
          that.setData({
            warnToast: false,
            hidewarnToast: false,
          });
        }, 300);
      }, 3000);
    }
  },
});
