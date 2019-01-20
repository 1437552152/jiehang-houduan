var express = require("express");
var router = express.Router();
var db = require("../conf/conf.js");
var formaDate = require("../utils/date.js");
var multer = require("multer");
//统一返回格式
var responseData;
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ""
  };
  next();
});
// 字段说明
//  isShow：0 表示展示      1 表示物理删除即隐藏

//首页报名数据
router.post("/baoming", function (req, res) {
  let studentName = req.query.username;
  let phone = req.query.phone;
  let wantCountry = req.query.wantCountry;
  let wantSchool = req.query.wantSchool;
  let QQ = req.query.QQ;
  let email = req.query.email;
  let major = req.query.major;
  let xueli = req.query.xueli;
  let isShow = 0;
  if (studentName == null || phone == null || wantCountry == null || major == null || studentName == '' || phone == '' || wantCountry == '' || major == '') {
    res.json({
      msg: "提交失败,请完善表单",
      status: "0"
    });
    return false;
  }
  let sql =
    "insert  into  reportList(studentName,phone,wantCountry,major,isShow) values(?,?,?,?,?)";
  var params = [
    studentName,
    phone,
    wantCountry,
    major,
    isShow
  ];
  db.query(sql, params, function (err, results) {
    if (err) {
      throw err;
    } else {
      res.json({
        msg: "提交成功",
        status: "200"
      });
    }
  });
});
//弹框报名
router.post("/tankuangbaoming", function (req, res) {
  let studentName = req.body.studentName;
  let phone = req.body.phone;
  let wantCountry = req.body.wantCountry;
  let wantSchool = req.body.wantSchool;
  let QQ = req.body.QQ;
  let email = req.body.email;
  let major = req.body.major;
  let xueli = req.body.xueli;
  let isShow = 0;
  if (studentName == null || phone == null || wantCountry == null || major == null || studentName == '' || phone == '' || wantCountry == '' || major == '') {
    res.json({
      msg: "提交失败,请完善表单",
      status: "0"
    });
    return false;
  }
  let sql =
    "insert  into  reportList(studentName,phone,wantCountry,major,isShow) values(?,?,?,?,?)";
  var params = [
    studentName,
    phone,
    wantCountry,
    major,
    isShow
  ];
  db.query(sql, params, function (err, results) {
    if (err) {
      throw err;
    } else {
      res.json({
        msg: "提交成功",
        status: "200"
      });
    }
  });
});
//留言表单
router.post("/liuyan", function (req, res) {
  let username = req.query.username;
  let phone = req.query.phone;
  let QQ = req.query.QQ;
  let email = req.query.email;
  let content = req.query.content;
  let isShow = 0;
  let addtime = formatDate();
  if (username == null || phone == null || content == null) {
    res.json({
      msg: "提交失败,请完善表单",
      status: "0"
    });
    return false;
  }
  let sql =
    "insert  into  MessageBoard(username,phone,QQ,email,content,isShow,addtime) values(?,?,?,?,?,?,?)";
  var param = [username, phone, QQ, email, content, isShow, addtime];
  db.query(sql, param, function (err, results) {
    if (err) {
      throw err;
    } else {
      res.json({
        msg: "留言成功",
        status: "200"
      });
    }
  });
});





// 公司简介
router.post("/companyprofile", function (req, res) {
  let type = req.query.type;
  let sql = `SELECT * FROM Companyprofile where isShow=0 and type=${type}`;
  db.query(sql, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});

// -------------------------------------------------------------------------------------------------------------------------
// 首页各所学校信息
router.get("/indexSchool", (req, res) => {
  let sql = `SELECT * FROM  famousschools   where isShow=0  group by  country`;
  db.query(sql, (err, results) => {
    if (err) {
      res.json({
        msg: "失败",
        status: "0",
        msg: err
      });
    } else {
      var getData1 = Promise.all(results.map(item => {
        let sql = `SELECT * FROM famousschools   where isShow=0  and  country='${
          item.country}' limit 8`;
        return new Promise((resolve, reject) => db.query(sql, (err, respon) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              country: item.country,
              countrylist: respon
            });
          }
        }));
      }));
      getData1.then(function (respon) {
        res.json({
          msg: "成功",
          status: 200,
          data: respon
        });
      }).catch(err => res.json({
        msg: "失败",
        status: "0",
        msg: err
      }));
    }
  });
});

//得到学校详情
//得到学校详情
router.post("/getschooldetail", function (req, res) {
  let id = req.query.Id;
  let sql1 = `SELECT * FROM famousschools where isShow=0 and Id=(select id from famousschools where id < ${id} order by id desc limit 1)`;
  let sql2 = `SELECT * FROM famousschools where isShow=0 and Id=(select id from famousschools where id > ${id} order by id asc limit 1)`;
  let sql3 = `SELECT * FROM famousschools where isShow=0 and Id=${id}`;
  let sql = `${sql1};${sql2};${sql3}`
  db.query(sql, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
        data1: results[0],
        data2: results[1],
        data3: results[2],
      });
    }
  });
});
// -----------------------------------------------------------------------------------------------------------------
//得到单个国家的信息
router.get('/countryInfo', function (req, res) {
  var responseData = {};
  let id = req.query.id;
  let sql1 = `SELECT * FROM   countryconfig as ct, pricemeal  as  pi   where   ct.country=pi.country  and    pi.isShow=0 and  ct.Id=${id}  limit 3`;
  let sql2 = `SELECT * FROM countryconfig where isShow=0 and Id=${id}`;
  let sql3 = `SELECT * FROM  countryconfig as ct,news  as new   where  ct.country=new.country  and   new.isShow=0 and ct.Id=${id}  and new.newstype=1  limit 3`;
  let sql4 = `SELECT * FROM  countryconfig as ct,student  as stu   where  ct.country=stu.country  and   stu.isShow=0 and ct.Id=${id}`;
  let sql5 = `SELECT * FROM  countryconfig as ct,famousschools  as fam   where  ct.country=fam.country  and   fam.isShow=0 and ct.Id=${id}   limit 10`;
  let sql = `${sql1};${sql2};${sql3};${sql4};${sql5}`
  db.query(sql, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      responseData.pricemealdata = results[0];
      responseData.countryBannerdata = results[1];
      responseData.newsList = results[2];
      responseData.studentsList = results[3];
      responseData.schoolList = results[4];
      res.json({
        msg: "操作成功",
        status: "200",
        data: responseData
      });
    }
  });
})
// 一篇文章详情
router.get("/news/detail", function (req, res) {
  let id = req.query.Id;
  let sql1 = `SELECT * FROM news where isShow=0 and Id=(select id from news where id < ${id} order by id desc limit 1)`;
  let sql2 = `SELECT * FROM news where isShow=0 and Id=(select id from news where id > ${id} order by id asc limit 1)`;
  let sql3 = "SELECT * FROM news where isShow=0 and Id=" + id;
  let sql4 = "update news  set  view=view+1  where isShow=0 and Id=" + id;
  let sql = `${sql1};${sql2};${sql3};${sql4}`
  db.query(sql, function (err, results) {
    if (err) {
      throw err;
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
        data1: results[0],
        data2: results[1],
        data3: results[2],
      });
    }
  });
});
// 得到新闻列表
router.get("/news/list", function (req, res) {
  let allCount;
  let pageNo =  parseInt(req.query.pageNo);
  let pageSize = parseInt(req.query.pageSize);
  let id = req.query.Id;
  let sql = `SELECT COUNT(*) FROM  countryconfig as ct,news  as new   where  ct.country=new.country  and   new.isShow=0 and ct.Id=${id}`;
  let sql2 =
    `SELECT * FROM countryconfig as ct,news  as new   where  ct.country=new.country  and   new.isShow=0 and ct.Id=${id} limit` +
    " " +(pageNo - 1) * pageSize +"," + pageNo * pageSize;
  function getpage(params) {
    return new Promise((resolve, reject) => db.query(params, (err, respon) => {
      if (err) {
        throw err;
        reject(err);
      } else {
        resolve(respon);
      }
    }));
  }
  getpage(sql).then(function (res) {
    allCount = res[0]["COUNT(*)"];
  return  getpage(sql2);
  }).then(function (responseData) {
    var allPage = allCount / pageSize;
    var pageStr = allPage.toString();
    // 不能整除
    if (pageStr.indexOf(".") > 0) {
      allPage = parseInt(pageStr.split(".")[0]) + 1;
    }
    res.json({
      msg: "操作成功",
      status: "200",
      totalPages: allPage,
      data: responseData,
      total: allCount,
      currentPage: parseInt(pageNo)
    });

  })
});



























//获取套餐
router.get("/price/detail", function (req, res) {
  let id = 1;
  // let id = req.query.id;
  let sql = "SELECT * FROM pricemeal where Id=" + id;
  db.query(sql, function (err, results) {
    if (err) {
      throw err;
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});
// -----------------------------------------------------------------------------------------------------------------










//获取当前时间
function formatDate() {
  //把时间戳转化为日期对象
  let date = new Date();
  //调用封装，参数为日期对象和时间格式
  return formaDate.formaDate(date, "yyyy-MM-dd hh:mm");
}
//------------------------------图片上传------------------------------------------
//获取时间
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate =
    date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate.toString();
}
var datatime = "public/images/" + getNowFormatDate();
//将图片放到服务器
var storage = multer.diskStorage({
  // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
  destination: datatime,
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
});
router.post("/upload", upload.single("picUrl"), function (req, res) {
  res.json({
    state: 200,
    ret_code: req.file.path
  });
});
module.exports = router;
