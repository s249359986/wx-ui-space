Component({
  behaviors: [],
  properties: {
    rangeText:{
      type:Array,
      value:['今天','明天','后天']
    },
    range:{
      type:Number,
      value:7
    },
    rangeDate: {//预约单距离现在多久可以使用
      type: Number,
      value: 45
    },
    status:{
      type:String,
      value:'1',
      observer: function (newVal, oldVal) {
        this.initData()
      }
    }
  },
  data: { curSelectObj:{disText: '现在', datetime: ''}, items: [[], [], []], multiIndex: [0, 0, 0], curDate:new Date(),minutes:['00分','15分','30分','45分']},
  attached: function () {
    this.setData({
      curDate: new Date()
    })
    this.initData()
  },
  methods: {
    initData:function(){
      let nowDate = new Date(this.data.curDate)
      let items = []
      items = [[], [], []]
      let tempI=0
      if (this.getStatus() && nowDate.getHours()===23){
        tempI=1
      }
      for (let i = tempI; i < this.data.range + tempI; i++) {
        if(i < this.data.rangeText.length){
          items[0].push(this.data.rangeText[i])
        } else {
          let tempOtherDate = new Date(nowDate.getTime() + i * 24 * 60 * 60 * 1000)
          items[0].push(tempOtherDate.getMonth() + 1 + '月' + tempOtherDate.getDate() + '日')
        }
      }
      let hours = nowDate.getHours()
      for (let i = hours; i < 24; i++) {
        let temp
        if (this.getStatus() && i === hours) {
          if(i===23){
            for(let j=0;j<24;j++){
              temp=j+'点'
              items[1].push(temp)
            }
          }else{
            continue
          }
        } else {
          temp = i === hours ? '现在' : i + '点'
          items[1].push(temp)
        }
      }
      if (this.getStatus()) {
        let count = parseInt((120 - nowDate.getMinutes()-this.data.rangeDate)/15)
        let tempM=60
        for(let i=0;i<count;i++){
          tempM = tempM -15
          if(tempM===0)
          {
            items[2].push('00分')
          }else {
            items[2].push(tempM + '分')
          }
        }
        items[2].reverse()
      }
      this.setData({
        curSelectObj: {disText: '现在', datetime: new Date().getTime() },
        items: items,
      })

    },
    getStatus:function(){
      return parseInt(this.properties.status) === 2 || parseInt(this.properties.status) === 0
    },
    bindPickerChange: function (e) {
      let nowTime = new Date(this.data.curDate)
      let tempValue = e.detail.value
      if ((tempValue[0] + tempValue[1] + tempValue[2]) === 0) {
        if (this.getStatus()){
          let tempText = this.data.items[0][tempValue[0]] + this.data.items[1][tempValue[0]] + this.data.items[2][tempValue[0]]
          let tempHour = this.data.items[1][tempValue[1]].replace('点', '')
          let tempMinutes = Boolean(this.data.items[2].length)? this.data.items[2][tempValue[2]].replace('分', ''):0

          this.setData({
            curSelectObj: {disText: tempText, datetime: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), tempHour, tempMinutes, 0, 0).getTime() }
          })
          this.triggerEvent('onSelect', { disText: tempText, datetime: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), tempHour, tempMinutes, 0, 0).getTime() })
        }
        else {

          this.setData({
            curSelectObj: {disText: '现在', datetime: nowTime.getTime() }
          })

          this.triggerEvent('onSelect', { disText: '现在', datetime: nowTime.getTime() })
        }
      }
      if (tempValue[0] === 0 && tempValue[1] > 0) {
        let tempText = this.data.items[0][tempValue[0]] + this.data.items[1][tempValue[1]] + this.data.items[2][tempValue[2]]
        let tempHour = this.data.items[1][tempValue[1]].replace('点', '')
        let tempMinutes = Boolean(this.data.items[2].length) ?this.data.items[2][tempValue[2]].replace('分', ''):0

        this.setData({
          curSelectObj: { disText: tempText, datetime: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), tempHour, tempMinutes, 0, 0).getTime() }
        })

        this.triggerEvent('onSelect', { disText: tempText, datetime: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), tempHour, tempMinutes, 0, 0).getTime() })
      }

      if (tempValue[0] > 0 || tempValue[2]>0) {
        let tempText = this.data.items[0][tempValue[0]] + this.data.items[1][tempValue[1]] + this.data.items[2][tempValue[2]]
        let tempHour = this.data.items[1][tempValue[1]].replace('点', '')
        let tempMinutes = Boolean(this.data.items[2].length) ?this.data.items[2][tempValue[2]].replace('分', ''):0

        if(tempText.indexOf('undefined') > -1) {
          this.triggerEvent('onSelect', {disText:this.data.curSelectObj.disText ,datetime:this.data.curSelectObj.datetime} )
        } else {
          this.setData({
            curSelectObj: { disText: tempText, datetime: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() + tempValue[0], tempHour, tempMinutes, 0, 0).getTime() }
          })

          this.triggerEvent('onSelect', { disText: tempText, datetime: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() + tempValue[0], tempHour, tempMinutes, 0, 0).getTime() })
        }
      }

    },
    bindcolumnchange: function (e) {
      void 0
      let items = []
      if (this.getStatus()){
        if (e.detail.column === 0 && e.detail.value === 0) {
          items = this.data.items
          items[1] = []
          let nowDate = new Date(this.data.curDate)
          let hours = nowDate.getHours()+1
          for (let i = hours; i < 24; i++) {
            let temp =i + '点'
            items[1].push(temp)
          }
          if (hours===24){
            items[1]=[]
            for (let i = 0; i < 24; i++) {
              let temp = i + '点'
              items[1].push(temp)
            }
          }
          items[2] = []
          let count = parseInt((120 - nowDate.getMinutes() - this.data.rangeDate) / 15)
          let tempM = 60
          for (let i = 0; i < count; i++) {
            tempM = tempM - 15
            if (tempM === 0) {
              items[2].push('00分')
            } else {
              items[2].push(tempM + '分')
            }
          }
          items[2].reverse()
          this.setData({ items: items, multiIndex: [0, 0, 0] })
        }
        if (e.detail.column === 0 && e.detail.value > 0) {
          items = this.data.items
          items[1]=[]
          items[2] = this.data.minutes
          let hours = 0
          for (let i = hours; i < 24; i++) {
            let temp = i + '点'
            items[1].push(temp)
          }
          this.setData({ items: items })
        }
        if (e.detail.column === 1 && e.detail.value === 0) {
          items = this.data.items
          items[2] = ['45分']
          this.setData({ items: items })
        }
        if (e.detail.column === 1 && (e.detail.value > 0 || this.data.items[1][0] === '0点')) {
          items = this.data.items
          items[2] = this.data.minutes
          this.setData({ items: items })
        }

      }else{
        void 0
        if (e.detail.column === 0 && e.detail.value === 0) {
          items = this.data.items
          items[1] = []
          items[2] = []
          let nowDate = new Date(this.data.curDate)
          let hours = nowDate.getHours()
          for (let i = hours; i < 24; i++) {
            let temp = i === hours ? '现在' : i + '点'
            items[1].push(temp)
          }
          this.setData({ items: items, multiIndex: [0, 0, 0] })
        }
        if (e.detail.column === 0 && e.detail.value > 0) {

          items = this.data.items
          let hours = 0
          items[1]=[]
          items[2] = this.data.minutes
          for (let i = hours; i < 24; i++) {
            let temp = i + '点'
            items[1].push(temp)
          }
          this.setData({ items: items })
        }
        if (e.detail.column === 1 && e.detail.value === 0) {
          items = this.data.items
          items[2] = []
          this.setData({ items: items })
        }
        if (e.detail.column === 1 && (e.detail.value > 0 || this.data.items[1][0] === '0点')) {
          items = this.data.items
          items[2] = this.data.minutes
          this.setData({ items: items })
        }
      }
      let tempMultiIndex = this.data.multiIndex
      tempMultiIndex[e.detail.column] = e.detail.value
      this.setData({ multiIndex: tempMultiIndex})

    }

  }
})
