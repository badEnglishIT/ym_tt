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
    condition: false,
    thisID: 0,
    opct: false,//输入框透明
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
    //添加查看动态行为
    var url = app.d.hostUrl + 'Company/behavior';
    var data = {
      'staff_id': app.globalData.staffId,
      'company_id': app.globalData.companyId,
      'type': 8
    };
    app.http(url, data, 'post')
  },
  //点击图片预览
  preview:function(e){
    console.log(e);
    wx.previewImage({
      urls: e.currentTarget.dataset.src,
    })
  },
  //评论收起
  close() {
    this.showPl();
  },
  // 弹出评论
  showPl(e) {
    this.setData({ show: !this.data.show, murky: !this.data.murky, opct: true });
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
    var beforePage = that.data.page;
    console.log({ '之前页': that.data.page });
    if (that.data.load) {
      that.setData({ page: that.data.page + 1 });
    }
    if (that.data.page != beforePage) {
      that.dynamicList();
    }
  },
  // 跳转到公司详情
  toDetail(e) {
    console.log({
      '跳转到详情': e.currentTarget.dataset.id
    });
    wx.navigateTo({
      url: 'detail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 点赞
  clickLike(e) {
    console.log(app.globalData.loginInfo);
    var id = app.globalData.loginInfo['id'];
    var nickname = app.globalData.loginInfo['nickname'];
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    list[index]['is_like'] = 1;
    if (list[index]['user_like'].length == undefined) {
      list[index]['user_like'][id] = nickname;
    } else {
      list[index]['user_like'] = { [id]: nickname };
    }
    list[index]['showLike'] = true;
    var data = { id: list[index].id }
    app.http(app.d.hostUrl + 'Dynamic/like', data, 'post');
    this.setData({ list: list });
  },
  //取消点赞
  noLike(e) {
    var id = app.globalData.loginInfo['id'];
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    list[index]['is_like'] = 0;
    delete list[index]['user_like'][id];
    var showLike = false;
    for (var i in list[index]['user_like']) {
      showLike = true; break;
    }
    list[index]['showLike'] = showLike;
    var data = { id: list[index].id }
    app.http(app.d.hostUrl + 'Dynamic/noLike', data, 'post');
    this.setData({ list: list });
  },
  // 评论
  clickMsg(e) {
    this.setData({ focus: true, opct: false});
    console.log({ '评论': e });
    this.setData({ currentIndex: e.currentTarget.dataset.index });
  },
  //输入评论
  inputMsg: function (e) {
    this.setData({ inputValue: e.detail.value });
  },
  //确定评论
  confirmMsg: function () {
    
    var index = this.data.currentIndex;
    var value = this.data.inputValue;
    var list = this.data.list;
    console.log(index)
    console.log(list);
    var url = app.d.hostUrl + 'Dynamic/comment';
    var data = { id: list[index]['id'], msg: value }, that = this;
    console.log(list[index])
    app.http(url, data, 'post', function (res) {
      data.nickname = app.globalData.loginInfo.nickname;
      list[index]['commList'] = list[index]['commList'].concat(data);
      list[index]['showLike'] = true;

      console.log(list[index]['commList'].concat(data))
      console.log(res);
      that.setData({ list: list });

    })
    this.setData({ inputValue: '' });
    this.showPl();
  },
  // 评论折叠
  loadAll(e) {
    console.log(e);
    this.setData({ condition: !this.data.condition, thisID: e.currentTarget.dataset.id.id });
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
  },
  onShareAppMessage:function(res){
    if (res.from === 'button') {
      console.log(res.target.dataset)
      var data = res.target.dataset;
      if(data.type=='company'){
        return {
          title: this.data.list[data.index]['title'],
          path: '/pages/dynamic/detail?staffId=' + app.globalData.staffId + '&companyId=' + app.globalData.companyId + '&&id=' + this.data.list[data.index]['id'],
        }
      }else{
        return {
          title: this.data.staffInfo.nickname+'的动态',
          path: '/pages/dynamic/personDetail?staffId=' + app.globalData.staffId + '&companyId=' + app.globalData.companyId + '&&id=' + this.data.list[data.index]['id'],
        }
      }
    }
  }
})
