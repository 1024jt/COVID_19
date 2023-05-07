// 向服务器发送请求，获取服务器响应数据
$.ajax({
  url: 'http://127.0.0.1:5050/api/database',
  dataType: 'json',
  success: function (data) {
    // 传递数据
    sliderModule();
    everyList(data);
    top_Ten(data);
    importantCities(data);

  }

});

$.ajax({
  url: 'http://127.0.0.1:5050/api/sum',
  dataType: 'json',
  success: function (data) {
    // 传递数据
    myMap(data);
    // console.log()
  }

});

$.ajax({
  url: 'http://127.0.0.1:5050/api/sumtab',
  dataType: 'json',
  success: function (data) {
    // 处理数据

    addLine(data);

  }

});


// 滑块模块设计
function sliderModule() {

  var globalCount = 0;
  // 滑块模块
  $(document).ready(function () {
    // 初始化日期
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-06-07');

    // 格式化日期函数
    function formatDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return year + '年' + month + '月' + day + '日';
    }

    // 定时器函数
    function startSlider() {
      intervalId = setInterval(function () {
        var value = startDate.getTime();
        value = value + (globalCount * 86400000);
        $("#slider").slider("value", value);
        selectedDate = new Date(value);
        $("#timer").text(formatDate(selectedDate));
        globalCount++;
      }, 1000);

    }
    if (globalCount >= endDate.getTime()) {
      clearImmediate(intervalId);
    }
    // 停止定时器
    function stopSlider() {
      clearInterval(intervalId);
    }

    // 创建滑块
    $(document).ready(function () {
      $("#slider").slider({
        range: "min",
        min: startDate.getTime(),
        max: endDate.getTime(),
        // step: 86400000, // 一天的毫秒数
        // keyboard: true,
      });
      // 显示开始日期
      $("#timer").text(formatDate(startDate));
      // console.log(formatDate(startDate));
    });

    // 绑定开始按钮事件
    $("#startBtn").click(function () {
      startSlider();
    });

    // 绑定暂停按钮事件
    $("#stopBtn").click(function () {
      stopSlider();
    });
  });
}



// 各省疫情列表模块
function everyList(databases) {
  // console.log(count);

  // 0.从服务器响应的数据获取key键
  var keys = Object.keys(databases[0]);
  // 1.获取父元素
  // let marqueeViem = document.querySelector('.marquee-viem')

  var marquee = document.querySelector('#marq')
  // 2.循环row模块
  for (let i = 1; i <= keys.length - 2; i++) {
    var key = keys[i + 1]
    // 3.创建div class=row 模块
    var div = document.createElement('div')
    div.className = 'row'
    // console.log(div)
    // 4.准备内容
    div.innerHTML = `
       <span  class="col">${i}</span>
       <span  class="col">${key}</span>
       <span id="yes${i}" class="col">${databases[0][key]}</span>
       <span id="no${i}" class="col">${databases[158][key]}</span>
    `
    // 5.追加给父元素
    marquee.appendChild(div)
  }

  $(".ranking .marquee-viem .marquee").each(function () {

    var cloneRows = $(this).children().slice(0, $(this).children().length / 2).clone();
    $(this).append(cloneRows);

  });

  $(document).ready(function () {
    // 4.更新数据函数
    var index = 0;
    var intervalId;

    function updateData() {

      for (let i = 1; i <= keys.length - 2; i++) {
        var key = keys[i + 1]
        $("#yes" + i).text(databases[index][key]);
        $("#no" + i).text(databases[index + 158][key]);
      }
      index++;
    }

    // 5.开始和停止按钮的事件处理函数
    var startBtn = document.querySelector("#startBtn");
    var stopBtn = document.querySelector("#stopBtn");

    startBtn.addEventListener("click", function () {
      intervalId = setInterval(updateData, 1000);
    });

    stopBtn.addEventListener("click", function () {
      clearInterval(intervalId);
    });
  })
}




//重点城市监测模块
function top_Ten(database) {
  // 1.实例化对象
  myChart = echarts.init(document.querySelector(".top10"))
  // 2.指定配置和数据
  var option = {

    //提示框组件
    tooltip: {
      trigger: 'item',
    },
    xAxis: {
      type: 'category',
      data: ['浙江', '北京', '江苏', '河南', '陕西', '吉林', '上海']
    },
    axisLabel: {
      color: "#4c9bfd"
    },
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: 'skyblue' // 0% 处的颜色
      }, {
        offset: 1, color: 'blue' // 100% 处的颜色
      }],
      globalCoord: false // 缺省为 false
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增有症状',
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#ff7f50' },
                { offset: 1, color: '#ff4500' }
              ]
            )
          }
        }
      },
      {
        name: '新增无症状',
        data: [220, 150, 50, 70, 50, 50, 100],
        type: 'bar',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#00bfff' },
                { offset: 1, color: '#1e90ff' }
              ]
            )
          }
        }
      }
    ],
    legend: { // 配置图例
      data: ['新增有症状', '新增无症状'],
      right: '1%',
      top: '3%',
      textStyle: {
        color: "#4c9bfd"
      }
    }
  };
  // 3.把配置和数据给实例对象
  myChart.setOption(option);

  // 4.修改数据的方法
  var index = 0;
  function updateData() {
    var arrs1 = [
      database[index]['浙江'],
      database[index]['北京'],
      database[index]['江苏'],
      database[index]['河南'],
      database[index]['陕西'],
      database[index]['吉林'],
      database[index]['上海'],
    ];

    var arrs2 = [ // 新的数据
      database[index + 158]['浙江'],
      database[index + 158]['北京'],
      database[index + 158]['湖北'],
      database[index + 158]['河南'],
      database[index + 158]['陕西'],
      database[index + 158]['山西'],
      database[index + 158]['上海'],
    ];
    myChart.setOption({
      series: [
        {
          data: arrs1
        },
        {
          data: arrs2
        }
      ]
    });
    index++;

  }

  // 5.开始和停止按钮的事件处理函数
  var intervalId; // 用于保存 setInterval 返回的 ID
  var startBtn = document.querySelector("#startBtn");
  var stopBtn = document.querySelector("#stopBtn");

  startBtn.addEventListener("click", function () {
    // updateData(); // 先调用一次，立即更新数据
    intervalId = setInterval(updateData, 1000); // 每秒钟调用一次
  });

  stopBtn.addEventListener("click", function () {
    clearInterval(intervalId); // 停止定时器
  });
}


// 新闻列表模块
function importantCities() {

  null;
}


//疫情地图模块
function myMap(databases) {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".geo"));
  // 2. 指定配置和数据
  var option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['中国疫情图']
    },
    visualMap: {
      type: 'piecewise',
      pieces: [
        { min: 1000, max: 1000000, label: '大于等于1000人', color: '#372a28' },
        { min: 500, max: 999, label: '确诊500-999人', color: '#4e160f' },
        { min: 100, max: 499, label: '确诊100-499人', color: '#974236' },
        { min: 10, max: 99, label: '确诊10-99人', color: '#ee7263' },
        { min: 1, max: 9, label: '确诊1-9人', color: '#f5bba7' },
      ],
      textStyle: {
        color: 'skyblue'
      },
      color: ['#E0022B', '#E09107', '#A3E00B']
    },
    series: [
      {
        name: '确诊数',
        type: 'map',
        mapType: 'china',
        roam: true,
        label: {
          show: true,
          color: 'rgb(249, 249, 249)'
        },
        zoom: 1.2,
        itemStyle: {
          emphasis: {
            areaColor: "#C8DDE3"
          }
        },
        data: [
          {
            name: '北京',
            value: 212
          }, {
            name: '天津',
            value: 60
          }, {
            name: '上海',
            value: 208
          }, {
            name: '重庆',
            value: 337
          }, {
            name: '河北',
            value: 126
          }, {
            name: '河南',
            value: 675
          }, {
            name: '云南',
            value: 117
          }, {
            name: '辽宁',
            value: 74
          }, {
            name: '黑龙江',
            value: 155
          }, {
            name: '湖南',
            value: 593
          }, {
            name: '安徽',
            value: 480
          }, {
            name: '山东',
            value: 270
          }, {
            name: '新疆',
            value: 29
          }, {
            name: '江苏',
            value: 308
          }, {
            name: '浙江',
            value: 829
          }, {
            name: '江西',
            value: 476
          }, {
            name: '湖北',
            value: 13522
          }, {
            name: '广西',
            value: 139
          }, {
            name: '甘肃',
            value: 55
          }, {
            name: '山西',
            value: 740000
          }, {
            name: '内蒙古',
            value: 34
          }, {
            name: '陕西',
            value: 142
          }, {
            name: '吉林',
            value: 42
          }, {
            name: '福建',
            value: 179
          }, {
            name: '贵州',
            value: 56
          }, {
            name: '广东',
            value: 797
          }, {
            name: '青海',
            value: 15
          }, {
            name: '西藏',
            value: 1
          }, {
            name: '四川',
            value: 282
          }, {
            name: '宁夏',
            value: 34
          }, {
            name: '海南',
            value: 79
          }, {
            name: '台湾',
            value: 10
          }, {
            name: '香港',
            value: 15
          }, {
            name: '澳门',
            value: 9
          }
        ]
      }
    ]
  };
  // 3. 把数据和配置给实例对象
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });

  // 4.修改数据的方法
  var index = 0;
  function updateData() {
    myChart.setOption({
      series:
      {
        data: databases[index]
      }
    });
    index++;
  }

  // 5.开始和停止按钮的事件处理函数
  var intervalId; // 用于保存 setInterval 返回的 ID
  var startBtn = document.querySelector("#startBtn");
  var stopBtn = document.querySelector("#stopBtn");

  startBtn.addEventListener("click", function () {
    // updateData(); // 先调用一次，立即更新数据
    intervalId = setInterval(updateData, 1000); // 每秒钟调用一次
  });

  stopBtn.addEventListener("click", function () {
    clearInterval(intervalId); // 停止定时器
  });

}


//新增确诊趋势模块制作
function addLine(database) {
  var myChart;
  // 初始化echarts
  myChart = echarts.init(document.querySelector('.line'));

  // 初始化一个空的数据数组
  var data1 = [];
  var data2 = [];

  // 初始化 option 对象
  var option = {
    color: ["#ed3f35", "#00f2f1"],
    // 配置图表的标题
    // 配置图表的工具栏
    tooltip: {
      trigger: 'axis'
    },
    // 配置图表的 X 轴
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      // 去除刻度
      axisTick: {
        show: false
      },
      // 修饰刻度标签的颜色
      axisLabel: {
        color: "#4c9bfd"
      },
      // 去除x坐标轴的颜色
      axisLine: {
        show: false
      }
    },
    // 配置图表的 Y 轴
    yAxis: {
      type: "value",
      // 去除刻度
      axisTick: {
        show: false
      },
      // 修饰刻度标签的颜色
      axisLabel: {
        color: "#4c9bfd"
      },
      // 修改y轴分割线的颜色
      splitLine: {
        lineStyle: {
          color: "#012f4a"
        }
      }
    },
    legend: {
      // 距离容器10%
      right: "10%",
      // 修饰图例文字的颜色
      textStyle: {
        color: "#4c9bfd"
      }
    },

    // 配置图表的系列
    series: [
      {
        name: '新增有症状',
        type: 'line',
        data: data1,
        // 线条样式配置
        lineStyle: {
          color: '#c23531'
        },
        // 是否让线条更圆滑
        smooth: true,
      },
      {
        name: '新增无症状',
        type: 'line',
        data: data2,
        // 线条样式配置
        lineStyle: {
          color: '#61a0a8'
        },
        // 是否让线条更圆滑
        smooth: true,
      }
    ]
  }

  // 3.把配置和数据给实例对象
  myChart.setOption(option);

  // 4.修改数据的方法
  var count = 0;
  function updateData() {
    // 获取数据
    var value1 = database[count]["有症状"];
    var value2 = database[count]["无症状"];

    // 更新数据数组
    data1.push(value1);
    data2.push(value2);

    // 更新 X 轴数据
    option.xAxis.data.push(database[count]['日期']);
    if (option.xAxis.data.length > 6) {
      option.xAxis.data.shift();
      // 移除数据数组的第一个元素
      data1.shift();
      data2.shift();
    }
    count++;
    // 更新图表
    myChart.setOption(option);
  }

  // 5.开始和停止按钮的事件处理函数
  var intervalId; // 用于保存 setInterval 返回的 ID
  var startBtn = document.querySelector("#startBtn");
  var stopBtn = document.querySelector("#stopBtn");

  startBtn.addEventListener("click", function () {
    // updateData(); // 先调用一次，立即更新数据
    intervalId = setInterval(updateData, 1000); // 每秒钟调用一次
  });

  stopBtn.addEventListener("click", function () {
    clearInterval(intervalId); // 停止定时器
  });

}





