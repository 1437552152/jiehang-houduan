/**
 * Created by 毅 on 2016/7/30.
 * 应用程序的启动（入口）文件
 */

//加载express模块
var express = require("express");
// 图片上传
var db = require("./conf/conf.js");
//加载模板处理模块
var swig = require("swig");
//加载body-parser，用来处理post提交过来的数据
var bodyParser = require("body-parser");
//加载cookies模块
var Cookies = require("cookies");
//创建app应用 => NodeJS Http.createServer();
var app = express();
//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use(express.static('public'));
//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine("html", swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set("views", "./views");
//注册所使用的模板引擎，第一个参数必须是 view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set("view engine", "html");
//在开发过程中，需要取消模板缓存
swig.setDefaults({
  cache: false
});
//bodyparser设置
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//设置跨域访问
//设置允许跨域访问该服务.
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  // res.header("Access-Control-Allow-Headers", "Content-Type");
  // res.header("Access-Control-Allow-Methods", "*");
  // res.header("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  next();
});
/*
 * 根据不同的功能划分模块
 * */
//案例展示

// 留言列表
app.get("/questCenter", function (req, res) {
  let sql = "SELECT * FROM MessageBoard where isShow=0 and status=1 limit 8";
  db.query(sql, function (err, results) {
    if (err) {
      res.render('questCenter',{
        msg: "操作成功",
        status: "0",
        data: "操作数据库失败"
      });
    } else {
      res.render('questCenter', {
        msg: "操作成功",
        status: "200",
        data: results
    });

    }
  });
});
// 头部导航国家的获取
app.get("/questCenter", (req, res) => {
  let sql = `SELECT * FROM countryconfig   where isShow=0  group by  typeid`;
  db.query(sql, (err, results) => {
    if (err) {
      res.render('questCenter',{
        msg: "失败",
        status: "0",
        msg: err
      });
    } else {
      var getData1 = Promise.all(results.map(item => {
        let sql = `SELECT * FROM countryconfig   where isShow=0  and  typeid='${
          item.typeid
        }'`;
        return new Promise((resolve, reject) => db.query(sql, (err, respon) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              typeid: item.typeid,
              countrylist: respon
            });
          }
        }));
      }));
      getData1.then(function (respon) {
        res.render('questCenter',{
          msg: "成功",
          status: 200,
          list: respon
        });
      }).catch(err => res.render('questCenter',{
        msg: "失败",
        status: "0",
        msg: err
      }));
    }
  });
});



app.use("/admin", require("./routes/admin"));
app.use("/user", require("./routes/user"));
app.listen(8080);




