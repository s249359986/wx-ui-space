/* eslint-disable */
module.exports = {
  header: {
    logo: {
      image: '',
      title: 'spaceUi 小程序',
      href: ''
    },
    nav: {
      lang: {
        text: 'En',
        from: 'zh-CN',
        to: 'en-US'
      },
      github: 'https://github.com/s249359986/wx-ui-space'
    }
  },
  footer: {
    github: '',
    nav: {
      'React 组件库': '',
      'Vue 组件库': '',
      意见反馈: '',
      开发指南: '',
      加入我们: ''
    }
  },
  plugins: [require('./website/plugins/wxapp-demo.js')],
  docs: {
    base: 'zanui',
    default: 'icon',
    category: [{
        base: 'base',
        label: '基础',
        include: {
          icon: require('./packages/icon/README.md'),
          datetimepicker: require('./packages/datetimepicker/README.md')
        }
      }],
    include: {
      cell: require('./packages/cell/README.md'),
      helper: require('./packages/helper/README.md'),
      panel: require('./packages/panel/README.md')
    }
  }
}