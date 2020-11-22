module.exports = {


  friendlyName: 'Format date',


  description: '日期格式化.',


  inputs: {
    date: {
      type: 'ref',
      description: '格式化的日期',
      defaultsTo: new Date()
    },
    pattern: {
      type: 'string',
      description: '日期格式化模版',
      required: true,
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    let o = {
      "M+": inputs.date.getMonth() + 1,               //月份
      "d+": inputs.date.getDate(),                    //日
      "h+": inputs.date.getHours(),                   //小时
      "m+": inputs.date.getMinutes(),                 //分
      "s+": inputs.date.getSeconds(),                 //秒
      "q+": Math.floor((inputs.date.getMonth() + 3) / 3), //季度
      "S": inputs.date.getMilliseconds()              //毫秒
    };
    if (/(y+)/.test(inputs.pattern)) {
      inputs.pattern = inputs.pattern.replace(RegExp.$1, (inputs.date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(inputs.pattern)) {
        inputs.pattern = inputs.pattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return inputs.pattern;
  }


};

