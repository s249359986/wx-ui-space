Component({
  behaviors: [],
  properties: {
    range:{
      type:Number,
      value:7
    },
    status:{
      type:String,
      value:'1',
      observer: function (newVal, oldVal) {
        this.initData()
      }
    }
  },
  data: { items: [[], [], []], multiIndex: [0, 0, 0], curDate:new Date(),minutes:['00分','15分','30分','45分']},
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
        switch (i) {
          case 0:
            items[0].push('今天')
            break;
          case 1:
            items[0].push('明天')
            break;
          case 2:
            items[0].push('后天')
            break;
          default:
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
        let count = parseInt((120 - nowDate.getMinutes()-45)/15)
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
        items: items
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
          this.triggerEvent('onSelect', { disText: tempText, datetime: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), tempHour, tempMinutes, 0, 0).getTime() })
        }
        else {
          this.triggerEvent('onSelect', { disText: '现在', datetime: nowTime.getTime() })
        }
      }
      if (tempValue[0] === 0 && tempValue[1] > 0) {
        let tempText = this.data.items[0][tempValue[0]] + this.data.items[1][tempValue[1]] + this.data.items[2][tempValue[2]]
        let tempHour = this.data.items[1][tempValue[1]].replace('点', '')
        let tempMinutes = Boolean(this.data.items[2].length) ?this.data.items[2][tempValue[2]].replace('分', ''):0
        this.triggerEvent('onSelect', { disText: tempText, datetime: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), tempHour, tempMinutes, 0, 0).getTime() })
      }

      if (tempValue[0] > 0 || tempValue[2]>0) {
        let tempText = this.data.items[0][tempValue[0]] + this.data.items[1][tempValue[1]] + this.data.items[2][tempValue[2]]
        let tempHour = this.data.items[1][tempValue[1]].replace('点', '')
        let tempMinutes = Boolean(this.data.items[2].length) ?this.data.items[2][tempValue[2]].replace('分', ''):0
        this.triggerEvent('onSelect', { disText: tempText, datetime: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() + tempValue[0], tempHour, tempMinutes, 0, 0).getTime() })
      }
      
    },
    bindcolumnchange: function (e) {      
      console.info(this.data.multiIndex)
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
          let count = parseInt((120 - nowDate.getMinutes() - 45) / 15)
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
        console.info(e)
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