## 基于Node.js、SUI构建的单页webApp-SPA

---

### 项目截图
![print](./client/public/images/assets-src/print.png)


### 运行环境
 1. node v4.4.5
 2. npm v2.15.5


###主要功能

* 天气预报（中国气象局API）
    *  采用爬虫+接口相结合方式，支持所有地区天气查询

* 百度LBS路线查询、导航

* 用户模块
    *  手机验证码注册（阿里大鱼API）
    *  支持密码、手机验证码两种登入方式
    *  用户头像异步无刷新上传

* 商品模块
    *  用户评论无限盖楼


* 火车票在线查询（12306官方接口）

* 股票查询（聚合数据API）


###涉及技术

* 前端：Zepto.js、SUI-Mobile、ECMAScript 6
* 后端：Node.js、Express
* 其它：OSS阿里云存储、阿里大鱼短信



### 目录结构
<pre>

├── README.md             
├── client                
│   ├── index.html        // 前端主入口
│   └── public            
│       ├── images        
│       ├── js            
│       └── css           
│
├── server                 
│   ├── app  
│   │   ├── controllers   // 控制器
│   │   ├── views         // 视图
│   │   ├── models        // 数据类
│   │   └── schemas       // 数据模型
│   │
│   ├── config            
│   │   ├── config.js     // 项目全局配置
│   │   └── routes.js     // 路由配置
│   │
│   ├── lib               
│   │   ├── alidayu       // 阿里大鱼工具类
│   │   └── function.js   // 项目公共方法
│   │
│   ├── public            
│   │    ├── upload       // 上传文件目录
│   │    ├── libs         // 第三方类库
│   │    ├── js           
│   │    └── css          
│   │
│   ├── app.js            // 后端主入口
│   ├── package.json      // nodejs配置文件
│   └── gruntfile.js      // grunt相关配置

</pre>




### 安装步骤

```bash
# 下载项目
  git clone https://github.com/chenlei-github/webapp-spa.git

# 切换到服务端目录
  cd webapp-spa/server/

# 获取项目依赖
  npm install

# 启动服务
  grunt

```

#### 访问地址：
 - 前端首页：webapp-spa/client/index.html (直接用浏览器打开)
 - 后台管理：http://localhost:3000/






