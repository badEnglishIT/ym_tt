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
    //员工信息
    staffInfo:[],
    //公司信息
    basicInfo:[],
    //动态列表
    list:[],
  },
  //查询员工信息
  staffInfo:function(){
    var that=this;
    var url=app.d.hostUrl+'company/staffInfo';
    var data={
      'staff_id':app.globalData.staffId,
      'company_id':app.globalData.companyId
    };
    app.http(url,data,'get',function(res){
      console.log(res)
      that.setData({staffInfo:res.data})
    })
  },
  //查询公司基本信息
  basicInfo:function(){
    var that = this;
    var url = app.d.hostUrl + 'company/basicInfo';
    var data = {
      'company_id':app.globalData.companyId,
    };
    app.http(url, data, 'get', function (res) {
      console.log({'公司基本信息':res})
      that.setData({ basicInfo: res.data })
    })
  },
  // 查询动态列表
  dynamicList:function(){
    var that=this;
    var url = app.d.hostUrl + 'Dynamic/lists';
    var data = {
      'staff_id': app.globalData.staffId,
      'company_id': app.globalData.companyId,
      'page':1,
    };
    app.http(url, data, 'get', function (res) {
      console.log({'res':res})
      // that.setData({list:res.data});
      //遍历数据列表 更改列表里的一项属性值(时间的显示)
      res.data.forEach(v => {    //改变时间显示方式
        var timeArr = v.add_time.split(" ");
        var oldFormat = v.add_time;
        var newFormat = oldFormat.replace(new RegExp("-", "g"), "/"); //用正则转换格式
        var getMs = (new Date(newFormat)).getTime(); //得到毫秒数
        var nowMs = new Date().getTime();
        var timeLag = nowMs / 1000 - getMs / 1000;
        if (timeLag > 86400) {   //判读时间距今超多一天没有
          v.add_time = timeArr[0];
        } else {
          v.add_time = timeArr[1];
        }
      });
      //判断数据量 然后根据数据量控制页底的显示与提示
      if (that.data.page == 1 && res.data.length < 10) {
        that.setData({ load: false, tip: '目前没有了', list: that.data.list.concat(res.data) });
      } else if (res.length < 10) {
        that.setData({ load: false, tip: '已经到底了', list: that.data.list.concat(res.data) });
      } else {
        that.setData({ load: true, tip: '正在加载', list: that.data.list.concat(res.data) });
      }
    },function(res){
      console.log({ '异常': res });
      if (that.data.page > 1) {
        that.setData({ load: false, tip: '已经没有了', list: that.data.list.concat(res.data) });
      } else {
        that.setData({ load: false, tip: '暂无数据', list: res.data });
      }
    })
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
  onLoad: function (options) {
    this.staffInfo();
    this.basicInfo();
    this.dynamicList();
    console.log(this.data)
  }
})
