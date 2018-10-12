// pages/dynamic/dynamic.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    thisDH: '',
    show: false,
    tip: '',
    showDelModal: false,
    load: true,
    murky: true,
    allDynamic: [],
    animationData: {},
    delID: '',
    actions: [
      {
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ],
    allDynamic: [
      {
        "id": 8, "details": "\u6492\u6253\u53d1\u6492\u6253\u53d1\u7b2c\u4e09\u65b9", 
        "imgs": null, "user_like": { "83": "123" }, "add_time": "2018-10-06 14:41", 
        "photo": "http:\/\/push.com\/static\/images\/photo\/20180928\/JN153l8r1M04F802.png", 
        "commList": [], "nickname": "123", "is_like": 1, "showLike": true
      },
      { 
        "id": 7, "details": "\u963f\u65af\u987f\u53d1\u662f\u7684\u6492\u53d1\u751f", 
        "imgs": null, "user_like": [], "add_time": "2018-10-06 14:40", "commList": [], 
        "photo": "http:\/\/push.com\/static\/images\/photo\/20180928\/JN153l8r1M04F802.png", 
        "nickname": "123",  "is_like": 0 
      }, 
      { 
        "id": 6, "details": "\u963f\u9053\u592b", "imgs": null, "user_like": [], 
        "add_time": "2018-10-06 14:09", "commList": [], "nickname": "123", 
        "photo": "http:\/\/push.com\/static\/images\/photo\/20180928\/JN153l8r1M04F802.png", "is_like": 0 
      }, 
      { 
        "id": 3, "details": "\u963f\u65af\u987f\u53d1", "user_like": [],
        "imgs": ['https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1348489678,3535316951&fm=11&gp=0.jpg'],
        "add_time": "2018-10-06 12:44", "commList": [], "nickname": "123", 
        "photo": "http:\/\/push.com\/static\/images\/photo\/20180928\/JN153l8r1M04F802.png", "is_like": 0 
      }, 
      {
        "id": 2, "details": "郭她采了个洁", "user_like": [], 
        "imgs": [
          'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2534260202,508591724&fm=26&gp=0.jpg',
          'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=823085869,1644233068&fm=26&gp=0.jpg',
          'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3642968723,959289097&fm=26&gp=0.jpg',
          'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=620087452,772181271&fm=26&gp=0.jpg',
          // 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=916379520,3005327835&fm=26&gp=0.jpg'
        ], 
        "add_time": "2018-09-18 11:05", "commList": [{ "dy_id": 2, "msg": "234", "nickname": "123" }], 
        "nickname": "123", "photo": "http:\/\/push.com\/static\/images\/photo\/20180928\/JN153l8r1M04F802.png", "is_like": 0
      }
    ]
  },
  //点击图片预览
  preview:function(e){
    console.log(e);
    // wx.previewImage({
    // });
  },
  //评论收起
  close() {
    this.showPl();
  },
  // 弹出评论
  showPl(e) {
    this.setData({ show: !this.data.show, murky: !this.data.murky });
    var animation = wx.createAnimation({     //评论动画   点击弹出缩入
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "linear",
      delay: 0
    });
    if (this.data.show) {
      animation.translate('-9rem').step();
      this.setData({
        animationData: animation.export(),
        thisDH: e.currentTarget.dataset.id
      })
    } else {
      animation.translate('0rem').step();
      this.setData({
        animationData: animation.export(),
      })
      console.log(this.data.animationData);
    }
  },
  //下拉加载更多
  loadMore(e) {
    var that = this;
    console.log({ '加载更多': e });
    if (that.data.load) {
      that.setData({ page: that.data.page + 1 });
    }
  },
  // 跳转到详情
  toDetail(e) {
    console.log({ '跳转到详情': e
    });
  },
  // 点赞
  clickLike(e) {
    var index = e.currentTarget.dataset.index;
    this.data.allDynamic[index]['showLike'] = !this.data.allDynamic[index]['showLike']
    console.log({ '对了': e, '阿萨德': this.data.allDynamic[index]['showLike'] });
    var allDynamic = this.data.allDynamic;
    var id = app.globalData.loginInfo.id;
    console.log({ '点赞': e });
    console.log({ "用户id": app.globalData.loginInfo });
    if (allDynamic[index]['user_like'][id]) {
      console.log({ '已点赞': allDynamic[index]['user_like'][id] });
      delete allDynamic[index]['user_like'][id];
      allDynamic[index].is_like = 0;
      app.http(app.d.hostUrl + 'Dynamic/noLike', { id: allDynamic[index].id }, 'post');
      this.setData({ allDynamic: allDynamic })
    } else {
      console.log({ '没点赞': allDynamic[index] })
      //对象数组     [下标]     [属性]       { [对象属性] :对象值}
      allDynamic[index]['user_like'] = { [id]: allDynamic[index].nickname };
      console.log({ 'now': allDynamic[index] });
      allDynamic[index].is_like = 1;//先本地修改点赞状态
      app.http(app.d.hostUrl + 'Dynamic/like', { id: e.currentTarget.dataset.id }, 'post');//再将状态发给服务器
      this.setData({ allDynamic: allDynamic })
    }
  },
  // 评论留言
  clickMsg(e) {
    console.log(e);
  },
  // 动态请求
  dynamicsRequest() {},
  //删除当前动态
  delDynamic(e) {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {}
})
