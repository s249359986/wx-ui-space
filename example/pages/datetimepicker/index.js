

Page({
  data: {
    useCarTime: '现在',
    driver_status: '1'
  },
  handleSelect(res) {
    console.log('选择时间', res)
    if (res.detail.disText != '现在') {
      this.setData({
        isReserved: true
      })
    }else{
      this.setData({
        isReserved: false
      })
    }
    // 上传时间参数
    this.setData({
      useCarTime: res.detail.disText,
      serviceTime: res.detail.datetime
    })
  }
});
