// pages/dynamic/dynamic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs:[
      { img: '../../images/suibian.jpg', mode:'0'},
      { img: '../../images/Bosco.jpg', id: '1'},
      { img: '../../images/bosco1.jpg', id: '2'},
      { img: '../../images/Bosco.jpg', id: '3' },
      // { img: '../../images/suibian.jpg', id: '4' },
      // { img: '../../images/Bosco.jpg', id: '5' },
      // { img: '../../images/bosco1.jpg', id: '6' },
      // { img: '../../images/Bosco.jpg', id: '7' },
      // { img: '../../images/suibian.jpg', mode: '0' },
    ],
    asdf:['sa','ds','er','we'],
  },

  //点击图片预览
  preview:function(e){
    console.log(e);
    // wx.previewImage({
    // });
  },
  // 评论收起
  close() {
    // this.showPl();
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
  },
  // 跳转到详情
  toDetail(e) {
    console.log({ '跳转到详情': e });
  },
  // 点赞
  clickLike(e) {
    console.log({ '点赞': e });
  },
  // 评论留言
  clickMsg(e) {
    console.log(e);
  },
  // 动态请求
  dynamicsRequest() {
    
  },
  //删除当前动态
  delDynamic(e) {

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  }
})