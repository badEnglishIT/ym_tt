// pages/index/posterCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var width=300,height=190,cardWidth=300,cardHeight=450;
    this.setData({ width: cardWidth, height: cardHeight});
    const ctx = wx.createCanvasContext('firstCanvas');
    ctx.setFillStyle('white');//设置背景色
    ctx.fillRect(0, 0, cardWidth, cardHeight);
    //画背景图片
    ctx.drawImage('/images/card/background.png', 0, 0, width, height);
    ctx.setFillStyle('white');//设置默认字体颜色
    //写公司名称
    var right=20;//右边距
    var top=30;// 顶部边距
    ctx.setFontSize(14)
    ctx.setTextAlign('right')
    ctx.fillText('公司名称', width - right, top);
    ctx.save();//保存一下剪裁前的图层
    //画圆形头像
    var photoLeft = 25;//头像左边距
    var photoTop = top + 10;//头像顶部边距
    var photoWidth = 60, photoHeight=60;//头像高宽 
    //画头像的圆形线条
    ctx.beginPath();
    ctx.arc(photoLeft + photoWidth / 2, photoTop + photoHeight / 2,
     photoHeight / 2, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.stroke();
    //剪裁线条区域内的图像
    ctx.clip();
    ctx.drawImage('https://push.ymindex.com/static/simulate/photo/1.jpg', photoLeft, photoTop, photoWidth, photoHeight);
    ctx.restore();//恢复剪裁前的图层，与剪裁后的图层合并
    //写职位
    var titleLeft=photoLeft+photoWidth+10;//职位左边距
    var titleTop=photoTop+10;//职位顶部边距
    ctx.setFontSize(14);
    ctx.setTextAlign('left');
    ctx.fillText('职位名称', titleLeft, titleTop);
    //写名称
    var nameLeft=titleLeft;
    var nameTop=titleTop+20;
    ctx.setFontSize(14);
    ctx.fillText('员工名称', nameLeft, nameTop);
    //画电话图标
    var telLeft = photoLeft;//电话图标左边距
    var telTop=photoTop+photoHeight+10;//电话图标顶部边距
    var iconWidth=15,iconHeight=15;//图标宽、高度
    ctx.drawImage('/images/card/tel.png', telLeft,
    telTop, iconWidth, iconHeight);
    //写电话
    var telFLeft=telLeft+iconWidth+10;//电话左边距
    var telFTop=telTop+14;//电话顶部边距
    ctx.setFontSize(10);
    ctx.fillText('电话:', telFLeft, telFTop);
    //画邮箱图标
    var mailLeft=telLeft;//邮箱图标左边距
    var mailTop=telTop+iconHeight+5;//邮箱图标右边距
    ctx.drawImage('/images/card/envelope.png', mailLeft,
      mailTop, iconWidth, iconHeight);
    //写邮箱
    var mailFLeft = telFLeft;//邮箱左边距
    var mailFTop = mailTop+14;//邮箱顶部边距
    ctx.setFontSize(10);
    ctx.fillText('邮箱:', mailFLeft, mailFTop);
    //写地址图标
    var addressLeft=telLeft;//地址图标左边距
    var addressTop=mailTop+iconHeight+5;//地址图标顶部边距
    ctx.drawImage('/images/card/address.png', addressLeft,
      addressTop, iconWidth, iconHeight);
    //写地址
    var addressFLeft=telFLeft;//地址左边距
    var addressFTop=addressTop+14;//地址顶部边距
    ctx.fillText('地址:', addressFLeft, addressFTop);
    ctx.save();//保存一下剪裁前的图层
    //画圆形二维码
    var qrWidth=100,qrHeight=100;//二维码宽高
    var qrLeft=(width-qrWidth)/2;//二维码左边距
    var qrTop=height+20;//二维码顶部边距
    //画二维码的圆形线条
    ctx.arc(qrLeft + qrWidth / 2, qrTop + qrHeight / 2,
      qrHeight / 2, 0, 2 * Math.PI); 
    //剪裁线条区域内的图像
    ctx.clip();
    ctx.drawImage('https://push.ymindex.com/static/simulate/qrcode/qrcode.jpg', qrLeft, qrTop, qrWidth, qrHeight);
    ctx.restore();//恢复剪裁前的图层，与剪裁后的图层合并
    //写提示文字
    var TS='长按识别二维码';
    //获取提示文字宽度
    const metrics = ctx.measureText(TS)
    ctx.setFillStyle('black');
    var TSLeft = (width - metrics.width)/2;//地址左边距
    var TSTop = qrTop+qrHeight+20;//地址顶部边距
    ctx.fillText(TS, TSLeft, TSTop);
    ctx.draw();
  },

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})