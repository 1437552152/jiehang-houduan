var express = require("express");
var router = express.Router();
var db = require("../conf/conf.js");
var formaDate = require("../utils/date.js");
var multer = require("multer");
//统一返回格式
function getdata(params) {
  return new Promise((resolve, reject) => db.query(params, (err, respon) => {
    if (err) {
      reject(err);
      throw err;    
    } else {
      resolve(respon);
    }
  }));
}
router.post("/login", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  var   responseData = {
    code: 0,
    data: {
      admin:null,
      permissions:null
    },
    type:0,
    msg:"success"
  };
  let sql1 = `SELECT  * from sys_user where  username='${username}'`;
  let sql2=`SELECT * FROM  sys_menu WHERE  parentId = 0`
    getdata(sql1).then(function (respon) {
      responseData.data.admin=respon[0];  
    if(respon[0].password!=password){
      res.json({
        msg: "账号密码错误",
        code: 1,
      });
    }else{
      return getdata(sql2);
    }
   }).then(function(respon1){
    var getData1 = Promise.all(respon1.map(item => {
      let sql = `select * from  sys_menu  where  parentid='${
        item.menuId
      }'`;
      return new Promise((resolve, reject) => db.query(sql, (err, respon) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            icon:item.icon,
            name:item.name, 
            menuId:item.menuId,
            orderNum:item.orderNum,
            parentId:item.parentId,
            submenus: respon
          });
        }
      }));
    }));
    getData1.then(function (respon) {
      responseData.data.permissions=respon
      res.json(responseData);
    }).catch(err => res.json({
      msg: "失败",
      code: 1,
      msg: err
    }));
   })
    })
// 用户信息,个人中心
router.post("/system/employee/detail", function (req, res) {
  let id = req.body.id;
  let sql = "SELECT * FROM sys_user  where user_id=" + id;
  db.query(sql, function (err, results) {
    if (err) {
      throw err;
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results[0]
      });
    }
  });
}); 
// 修改密码
router.post("/system/employee/update-password", function (req, res) {
  let lastPassword = req.body.lastPassword;
  let newPassword = req.body.newPassword;
  let id = req.body.id;
  let sql = `SELECT * FROM sys_user  where user_id=${id}`;
  db.query(sql, function (err, results) {
    if (err) {
      throw err;
    } else {
    if(lastPassword!=results[0].password){
      res.json({
        message: "您输入的旧密码不正确",
        code:1
      });
    }else{
      let sql = `update  sys_user set  password=${newPassword} where  user_id=${id}`;
      db.query(sql, function (err, results) {
        if (err) {
          throw err;
        } else {
          res.json({
            message: "密码修改成功",
            code:0
          });
        }})
    } 
    }
  });
}); 












// 字段说明
//  isShow：0 表示展示      1 表示物理删除即隐藏
//----------------------------------------案例开始------------------
// 获得案例
router.post("/team", function (req, res) {
  let allCount;
  let pageNo = parseInt(req.body.pageNo);
  let pageSize = parseInt(req.body.pageSize);
  let sql = "SELECT COUNT(*) FROM student where isShow=0";
  let sql2 =
    "SELECT*FROM student where isShow=0 limit" +
    " " +
    (pageNo - 1) * pageSize +
    "," +
    pageNo * pageSize;
  db.query(sql, function (err, results) {
    if (err) {} else {
      allCount = results[0]["COUNT(*)"];
      back(allCount);
    }
  });

  function back(allCount) {
    db.query(sql2, function (err, results) {
      if (err) {} else {
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
          data: results,
          total: allCount,
          currentPage: parseInt(pageNo)
        });
      }
    });
  }
});
// 案例详情
router.post("/team/detail", function (req, res) {
  let id = req.body.id;
  let sql = "SELECT * FROM student where id=" + id;
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

// 案例详情修改
router.post("/team/update", function (req, res) {
  let studentname = req.body.studentname;
  let education = req.body.education;
  let school = req.body.school;
  let teachname = req.body.teachname;
  let pic = req.body.pic;
  let introduceBriefly = req.body.introduceBriefly;
  let languagelevel = req.body.languagelevel;
  let address = req.body.address;
  let score = req.body.score;
  let country = req.body.country;
  let content = req.body.content;
  let Id = req.body.Id;
  let sql =
    "UPDATE student set studentname=?,education=?,school=?,teachname=?,pic=?,introduceBriefly=?,languagelevel=?,address=?,score=?,country=?,content=? where id=?";
  var param = [
    studentname,
    education,
    school,
    teachname,
    pic,
    introduceBriefly,
    languagelevel,
    address,
    score,
    country,
    content,
    Id
  ];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
// 案例详情增加
router.post("/team/add", function (req, res) {
  let studentname = req.body.studentname;
  let education = req.body.education;
  let school = req.body.school;
  let teachname = req.body.teachname;
  let pic = req.body.pic;
  let introduceBriefly = req.body.introduceBriefly;
  let languagelevel = req.body.languagelevel;
  let address = req.body.address;
  let score = req.body.score;
  let country = req.body.country;
  let content = req.body.content;
  let isShow = 0;
  let sql =
    "insert  into student(studentname,education,school,teachname,pic,introduceBriefly,languagelevel,address,score,country,content,isShow) values(?,?,?,?,?,?,?,?,?,?,?,?)";
  var param = [
    studentname,
    education,
    school,
    teachname,
    pic,
    introduceBriefly,
    languagelevel,
    address,
    score,
    country,
    content,
    isShow
  ];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
// 物理删除一条
router.post("/team/delete", function (req, res) {
  let id = req.body.Id;
  let sql = "UPDATE student  set isShow=? where Id=?";
  let param = ["1", id];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
//----------------------------------------案例结束------------------

//----------------------------------------countryconfig开始------------------
router.post("/countryconfig", function (req, res) {
  let allCount;
  let pageNo = parseInt(req.body.pageNo);
  let pageSize = parseInt(req.body.pageSize);
  let sql = "SELECT COUNT(*) FROM countryconfig where isShow=0";
  let sql2 =
    "SELECT*FROM countryconfig where isShow=0 limit" +
    " " +
    (pageNo - 1) * pageSize +
    "," +
    pageNo * pageSize;
  db.query(sql, function (err, results) {
    if (err) {} else {
      allCount = results[0]["COUNT(*)"];
      back(allCount);
    }
  });

  function back(allCount) {
    db.query(sql2, function (err, results) {
      if (err) {} else {
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
          data: results,
          total: allCount,
          currentPage: parseInt(pageNo)
        });
      }
    });
  }
});
//countryconfig详情
router.post("/countryconfig/detail", function (req, res) {
  let id = req.body.Id;
  let sql = "SELECT * FROM countryconfig where Id=" + id;
  db.query(sql, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});
//countryconfig增加
router.post("/countryconfig/add", function (req, res) {
  let logo = req.body.logo;
  let pic1 = req.body.pic1;
  let pic2 = req.body.pic2;
  let pic3 = req.body.pic3;
  let country = req.body.country;
  let typeid = req.body.typeid;
  let isShow = 0;
  let sql =
    "insert  into countryconfig(logo,pic1,pic2,pic3,country,typeid,isShow) values(?,?,?,?,?,?,?)";
  var param = [logo, pic1, pic2, pic3, country, typeid, isShow];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
// 物理删除一条countryconfig
router.post("/countryconfig/delete", function (req, res) {
  let id = req.body.Id;
  let sql = "UPDATE countryconfig  set isShow=? where Id=?";
  let param = ["1", id];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
// 修改一条countryconfig
router.post("/countryconfig/update", function (req, res) {
  let logo = req.body.logo;
  let pic1 = req.body.pic1;
  let pic2 = req.body.pic2;
  let pic3 = req.body.pic3;
  let typeid = req.body.typeid;
  let country = req.body.country;
  let Id = req.body.Id;
  let sql =
    "UPDATE countryconfig set logo=?,pic1=?,pic2=?,pic3=?,typeid=?,country=?  where Id=?";
  var param = [logo, pic1, pic2, pic3, typeid, country, Id];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
//----------------------------------------banner结束------------------

// ------------------------文章开始-------------------------------------
// 文章列表
router.post("/news", function (req, res) {
  let allCount;
  let pageNo = parseInt(req.body.pageNo);
  let pageSize = parseInt(req.body.pageSize);
  let sql = "SELECT COUNT(*) FROM news where isShow=0";
  let sql2 =
    "SELECT*FROM news where isShow=0 limit" +
    " " +
    (pageNo - 1) * pageSize +
    "," +
    pageNo * pageSize;
  db.query(sql, function (err, results) {
    if (err) {} else {
      allCount = results[0]["COUNT(*)"];
      back(allCount);
    }
  });

  function back(allCount) {
    db.query(sql2, function (err, results) {
      if (err) {} else {
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
          data: results,
          total: allCount,
          currentPage: parseInt(pageNo)
        });
      }
    });
  }
});
//文章详情
router.post("/news/detail", function (req, res) {
  let id = req.body.id;
  let sql = "SELECT * FROM news where id=" + id;
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

// 文章修改
router.post("/news/update", function (req, res) {
  let title = req.body.title;
  let author = req.body.author;
  let des = req.body.des;
  let keyword = req.body.keyword;
  let newstype = req.body.newstype;
  let focusPic = req.body.pic;
  let country = req.body.country;
  let content = req.body.content;
  let Id = req.body.Id;
  let sql =
    "UPDATE news SET title=?,author=?,des=?,keyword=?,focusPic=?,newstype=?,country=?,content=?  where Id=?";
  var param = [
    title,
    author,
    des,
    keyword,
    focusPic,
    newstype,
    country,
    content,
    Id
  ];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
//文章增加
router.post("/news/add", function (req, res) {
  let title = req.body.title;
  let author = req.body.author;
  let des = req.body.des;
  let keyword = req.body.keyword;
  let newstype = req.body.newstype;
  let focusPic = req.body.pic;
  let country = req.body.country;
  let content = req.body.content;
  let isShow = 0;
  let time = formatDate();
  let sql =
    "insert  into  news(title,author,des,keyword,newstype,focusPic,country,content,isShow) values(?,?,?,?,?,?,?,?,?)";
  var param = [
    title,
    author,
    des,
    keyword,
    newstype,
    focusPic,
    country,
    content,
    isShow
  ];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
// 物理删除一条
router.post("/news/delete", function (req, res) {
  let id = req.body.Id;
  let sql = "UPDATE news  set isShow=? where Id=?";
  let param = ["1", id];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
//----------------------------------------文章结束------------------

// 公司简介--------------------------------
router.post("/company", function (req, res) {
  let sql = "SELECT * FROM Companyprofile where isShow=0";
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

//删除公司简介
router.post("/company/delete", function (req, res) {
  let id = req.body.Id;
  let sql = "UPDATE Companyprofile  set isShow=? where Id=?";
  let param = ["1", id];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
//公司详情
router.post("/company/detail", function (req, res) {
  let id = req.body.id;
  let sql = "SELECT * FROM Companyprofile where id=" + id;
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
//增加公司简介
router.post("/company/add", function (req, res) {
  let keywords = req.body.keywords;
  let type = req.body.type;
  //   let language = req.body.language;
  let content = req.body.content;
  let isShow = 0;
  let time = formatDate();
  let sql =
    "insert  into  Companyprofile(keywords,type,content,isShow,time) values(?,?,?,?,?)";
  var param = [keywords, type, content, isShow, time];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
//修改公司简介
// 文章修改
router.post("/company/update", function (req, res) {
  let keywords = req.body.keywords;
  let type = req.body.type;
  let content = req.body.content;
  let Id = req.body.Id;
  let sql = "UPDATE Companyprofile SET keywords=?,type=?,content=?  where Id=?";
  var param = [keywords, type, content, Id];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
//----------------------------------------文章结束------------------

//---------------------------------------------报名列表
router.post("/reportlist/reportlist", function (req, res) {
    let allCount;
    let pageNo = parseInt(req.body.pageNo);
    let pageSize = parseInt(req.body.pageSize);
    let sql =
      "SELECT COUNT(*) FROM reportList where isShow=0 order by reportTime desc";
    let sql2 =
      "SELECT * FROM reportList where isShow=0 limit" +
      " " +
      (pageNo - 1) * pageSize +
      "," +
      pageNo * pageSize;
    db.query(sql, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        allCount = results[0]["COUNT(*)"];
        back(allCount);
      }
    });

    function back(allCount) {
      db.query(sql2, function (err, results) {
        if (err) {} else {
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
            data: results,
            total: allCount,
            currentPage: parseInt(pageNo)
          });
        }
      });
    }
  }),
  //删除一个报名记录
  router.post("/reportlist/delete", function (req, res) {
    let id = req.body.Id;
    let sql = "UPDATE reportList  set isShow=? where Id=?";
    let param = ["1", id];
    db.query(sql, param, function (err, results) {
      if (err) {} else {
        res.json({
          msg: "操作成功",
          status: "200"
        });
      }
    });
  });

//留言列表
router.post("/submit/messagelist", function (req, res) {
    let allCount;
    let pageNo = parseInt(req.body.pageNo);
    let pageSize = parseInt(req.body.pageSize);
    let sql = "SELECT COUNT(*) FROM MessageBoard where isShow=0";
    let sql2 =
      "SELECT * FROM MessageBoard where isShow=0 limit" +
      " " +
      (pageNo - 1) * pageSize +
      "," +
      pageNo * pageSize;
    db.query(sql, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        allCount = results[0]["COUNT(*)"];
        back(allCount);
      }
    });

    function back(allCount) {
      db.query(sql2, function (err, results) {
        if (err) {} else {
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
            data: results,
            total: allCount,
            currentPage: parseInt(pageNo)
          });
        }
      });
    }
  }),
  //删除一个留言
  router.post("/submit/messagedelete", function (req, res) {
    let id = req.body.Id;
    let sql = "UPDATE MessageBoard  set isShow=? where Id=?";
    let param = ["1", id];
    db.query(sql, param, function (err, results) {
      if (err) {} else {
        res.json({
          msg: "操作成功",
          status: "200"
        });
      }
    });
  });
//留言回复
router.post("/submit/messageupdate", function (req, res) {
  let article = req.body.article;
  let Id = req.body.Id;
  let sql = "UPDATE MessageBoard SET article=?,status=1 where Id=?";
  var param = [article, Id];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});

//留言详情
router.post("/submit/messagedetail", function (req, res) {
  let Id = req.body.Id;
  let sql = "SELECT * FROM MessageBoard where Id=" + Id;
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
//后台获取国家接口
//获取国家接口
router.post("/country", function (req, res) {
  let isShow = 0;
  let sql = "SELECT * FROM countryconfig where isShow=0";
  db.query(sql, {}, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});
//--------------------------------------------后台展示著名学校-------------------------------------------------//
// 获得案例
router.post("/schoolList", function (req, res) {
  let allCount;
  let pageNo = parseInt(req.body.pageNo);
  let pageSize = parseInt(req.body.pageSize);
  let sql = "SELECT COUNT(*) FROM famousschools where isShow=0";
  let sql2 =
    "SELECT*FROM famousschools where isShow=0 limit" +
    " " +
    (pageNo - 1) * pageSize +
    "," +
    pageNo * pageSize;
  db.query(sql, function (err, results) {
    if (err) {} else {
      allCount = results[0]["COUNT(*)"];
      back(allCount);
    }
  });

  function back(allCount) {
    db.query(sql2, function (err, results) {
      if (err) {
        res.json({
          msg: err,
          status: "0"
        });
      } else {
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
          data: results,
          total: allCount,
          currentPage: parseInt(pageNo)
        });
      }
    });
  }
});

//删除一个学校
router.post("/schooldelete", function (req, res) {
  let id = req.body.Id;
  let sql = "UPDATE famousschools  set isShow=? where Id=?";
  let param = ["1", id];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});


//增加一个学校
router.post("/school/add", function (req, res) {
  let schoolName = req.body.schoolName;
  let des = req.body.des;
  let acceptanceRate = req.body.acceptanceRate;
  let country = req.body.country;
  let content = req.body.content;
  let logo = req.body.pic;
  let isShow = 0;
  let sql = "insert  into  famousschools(schoolName,des,acceptanceRate,country,content,logo,isShow) values(?,?,?,?,?,?,?)";
  var param = [schoolName, des, acceptanceRate, country, content, logo, isShow];
  db.query(sql, param, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
// 修改学校信息
router.post("/school/update", function (req, res) {
  let schoolName = req.body.schoolName;
  let des = req.body.des;
  let acceptanceRate = req.body.acceptanceRate;
  let country = req.body.country;
  let content = req.body.content;
  let logo = req.body.pic
  let Id = req.body.Id;
  let sql = "UPDATE famousschools SET schoolName=?,des=?,acceptanceRate=?,country=?,content=?,logo=? where Id=?";
  var param = [schoolName, des, acceptanceRate, country, content, logo, Id];
  db.query(sql, param, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});

//一个学校的详情
router.post("/school/detail", function (req, res) {
  let id = req.body.id;
  let sql = "SELECT * FROM famousschools where Id=" + id;
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
//--------------------------------------------后台展示著名学校结束-------------------------------------------------//


//--------------------------------------------价格套餐-------------------------------------------------//
// 获得套餐
router.post("/priceList", function (req, res) {
  let allCount;
  let pageNo = parseInt(req.body.pageNo);
  let pageSize = parseInt(req.body.pageSize);
  let sql = "SELECT COUNT(*) FROM pricemeal where isShow=0";
  let sql2 =
    "SELECT*FROM pricemeal where isShow=0 limit" +
    " " +
    (pageNo - 1) * pageSize +
    "," +
    pageNo * pageSize;
  db.query(sql, function (err, results) {
    if (err) {} else {
      allCount = results[0]["COUNT(*)"];
      back(allCount);
    }
  });

  function back(allCount) {
    db.query(sql2, function (err, results) {
      if (err) {
        res.json({
          msg: err,
          status: "0"
        });
      } else {
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
          data: results,
          total: allCount,
          currentPage: parseInt(pageNo)
        });
      }
    });
  }
});

//删除一个套餐
router.post("/price/delete", function (req, res) {
  let id = req.body.Id;
  let sql = "UPDATE pricemeal  set isShow=? where Id=?";
  let param = ["1", id];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
//增加一个套餐
router.post("/price/add", function (req, res) {
  let des = req.body.des;
  let country = req.body.country;
  let price = req.body.price;
  let addtime = req.body.addtime;
  let address = req.body.address;
  let isShow = 0;
  let sql = "insert  into  pricemeal(des,country,price,addtime,address,isShow) values(?,?,?,?,?,?)";
  var param = [des, country, price, addtime, address, isShow];
  db.query(sql, param, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
// 修改一个套餐
router.post("/price/update", function (req, res) {
  let des = req.body.des;
  let country = req.body.country;
  let price = req.body.price;
  let addtime = req.body.addtime;
  let address = req.body.address;
  let Id = req.body.Id;
  let sql = "UPDATE pricemeal SET des=?,country=?,price=?,addtime=?,address=? where Id=?";
  var param = [des, country, price, addtime, address, Id];
  db.query(sql, param, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});

//一个价格套餐详情
router.post("/price/detail", function (req, res) {
  let id = req.body.id;
  let sql = "SELECT * FROM pricemeal where Id=" + id;
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
//------------------------------------------------------ 价格套餐结束  ------------------------------------------------------------

//------------------------------- 该国留学的优势--------------------------------------

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
