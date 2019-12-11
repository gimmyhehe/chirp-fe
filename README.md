## 项目运行
```
// 拷贝项目至本地，并进入项目文件夹
git clone git@gitlab.com:gdufs-ucm/front-end-react.git
cd front-end-react

// 如果有安装 yarn ，可以直接输入 yarn 安装模块，否则请运行以下命令安装
npm install

// 如果是 node_modules 的模块有变化，或者是第一次运行，请运行以下命令
npm start

// 如果不是第一次运行，则直接运行以下命令
npm run dev
```

## 项目结构
```
.
├── build           // 项目开发的配置文件
├── config          // 项目的配置文件
├── src             // 项目的业务代码文件
│   ├── actions     // react-redux 的 action 文件
│   ├── api         // 向后台发送 ajax 请求的文件
│   ├── assets      // 静态资源文件，例如图片
│   ├── components  // react 的 UI 组件，尽量只负责 UI 的呈现，不带业务逻辑
│   ├── constants   // 常量文件
│   ├── containers  // react-redux 的容器组件，负责管理数据和业务逻辑，不负责 UI 的呈现
│   ├── decorators  // 抽象的应用于 react 组件的模块
│   ├── pages       // 项目页面，负责调用各个 components 组件
│   ├── reducers    // react-redux 的 reducer 文件
│   ├── routes      // react-router 的匹配路径的文件
│   ├── store       // react-redux 的 store 文件
│   └── utils       // 常用的公共模块
└── static          // 第三方的静态文件，比如引用的 css 和 js
```

## 项目文档
[后台 API 接口文档](https://gitlab.com/gdufs-ucm/UCM_Back_End/blob/master/apiDoc.md)

## 代码编写规范
首先，请安装对应 IDE 下的两个插件： eslint 和 editorconfig 。

eslint 插件能保证 JS 代码的规范性，使用它可以避免低级错误和统一代码的风格。下载方式因使用 IDE 不同可能会有差异（以 VSCode 为例，在 `扩展` 中搜索 `eslint` ，找到对应插件并安装，然后重启 VSCode 即可；其他 IDE 如 Sublime Text、WebStorm 请自行查找对应插件）。

 eslint 的匹配规则在项目目录下的 `.eslintrc.js` 这个文件中，具体的规则含义请参考 [这个网站](http://eslint.cn/docs/rules/) 或者查阅相关资料来理解。但是为了项目代码规范的一致性，请大家在修改规则之前先把问题 pull 到群上，大家讨论出一个共同的规则后再进行修改；请**不要私自修改规则**来绕过 eslint 的检查。

editorconfig 插件能保证不同类型的代码（如 js、jsx、html）有统一的缩进，规则文件在项目目录下的 `.editorconfig` 这个文件里（WebStorm好像能自动识别这个文件，但是 VSCode 和 Sublime Text 则需要手动安装插件）。匹配规则很简单，也不用大家做修改，让 IDE 自动完成缩进就可以了。

插件安装完成后，接下来就是正常的编码规范了。

JS 的编码规范参考 [React 代码规范 - 知乎](https://zhuanlan.zhihu.com/p/21458464)（补充：`locale` 文件夹中语言文件的字段命名统一为小写和下划线的组合，因为这些字段并不是变量）

HTML 和 CSS 的编码规范参考 [Bootstrap 的编码规范](http://codeguide.bootcss.com/)

注释的规范目前没有较全面的规范可以参考，但是建议采用 [API Doc](http://apidocjs.com/) 里面注释的规范来写注释。同时可以参考[Bootstrap 的编码规范](http://codeguide.bootcss.com/)里面的注释规范。

规范没有强制要求，但是好的规范能够很好地维护整个项目，所以希望大家能够尽力做好（实际中我也很少写注释 \_(:з」∠)\_ 希望能改正这个问题）。如果你在平常工作的时候有好的编码规范，欢迎在群上向大家提出来，我们共同讨论出一个共同的项目规范。

## 参考资料

### JS 语法相关
[ECMAScript 6 入门（阮一峰）](http://es6.ruanyifeng.com/)

### React、React-Router 和 React-Redux
[React 官方中文文档](https://doc.react-china.org/docs/hello-world.html)

[React Router 4 官方文档（英文）](https://reacttraining.com/react-router/web/guides/philosophy)

[Redux 入门教程（一）：基本用法（了解 Redux）](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)

[Redux 入门教程（二）：中间件与异步操作 （这个只需要了解即可，实际在项目中并不怎么需要用到）](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)

[Redux 入门教程（三）：React-Redux 的用法（实际在项目中用到）](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)

### 第三方框架
[Styled Component - React 的 CSS 组件框架](https://www.styled-components.com/docs/basics#getting-started)

[Ant Design (Antd) of React - 类似于 Bootstrap 的设计框架](https://ant.design/docs/react/introduce-cn)

[React-intl - React 项目的多语言支持](https://segmentfault.com/a/1190000005824920)

[React-intl 实现多语言](https://www.cnblogs.com/qiaojie/p/6411199.html)

[Moment - 日期处理框架](http://momentjs.cn/docs/)

### 其他相关资料
[Git 中 Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

## 写在最后
在查阅资料的过程中，如果发现了对开发有用的文档，欢迎放上来跟大家一起分享（或者可以直接分享在微信群）

最后祝大家工作愉快(～￣▽￣)～
