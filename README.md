# vue-music

> A vue-music webapp

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 项目架构：

|-- build/&nbsp;&nbsp;&nbsp;&nbsp;webpack的配置文件，包括基础，开发环境，生产环境  
|-- config/&nbsp;&nbsp;&nbsp;&nbsp;环境的配置文件  
|-- node_modules/&nbsp;&nbsp;&nbsp;&nbsp;项目的依赖包，自动生成  
|-- src/&nbsp;&nbsp;&nbsp;&nbsp;项目源代码  
&nbsp;&nbsp;&nbsp;&nbsp;|-- api/&nbsp;&nbsp;&nbsp;&nbsp;存放一些配置文件，请求后台的方法  
&nbsp;&nbsp;&nbsp;&nbsp;|-- assets/&nbsp;&nbsp;&nbsp;&nbsp;存放图片等资源  
&nbsp;&nbsp;&nbsp;&nbsp;|-- base/&nbsp;&nbsp;&nbsp;&nbsp;存放一些通用的vue组件  
&nbsp;&nbsp;&nbsp;&nbsp;|-- common/&nbsp;&nbsp;&nbsp;&nbsp;存放一些通用的js，fonts，css，image，可以在其他地方直接引用  
&nbsp;&nbsp;&nbsp;&nbsp;|-- components/&nbsp;&nbsp;&nbsp;&nbsp;此目录下按不同的页面存放不同的vue组件  
&nbsp;&nbsp;&nbsp;&nbsp;|-- router/&nbsp;&nbsp;&nbsp;&nbsp;项目的路由配置文件  
&nbsp;&nbsp;&nbsp;&nbsp;|-- App.vue&nbsp;&nbsp;&nbsp;&nbsp;vue入口文件  
&nbsp;&nbsp;&nbsp;&nbsp;|-- main.js&nbsp;&nbsp;&nbsp;&nbsp;js入口文件，并初始化部分参数  
|-- static/&nbsp;&nbsp;&nbsp;&nbsp;打包后的静态文件  
|-- .babelrc&nbsp;&nbsp;&nbsp;&nbsp;babel的设置  
|-- .editorconfig&nbsp;&nbsp;&nbsp;&nbsp;编译器的设置  
|-- eslintignore&nbsp;&nbsp;&nbsp;&nbsp;eslint的设置  
|-- eslintrc.js  
|-- gitignore  
|-- .postcssrc.js  
|-- index.html&nbsp;&nbsp;&nbsp;&nbsp;html的入口文件  
|-- package.json&nbsp;&nbsp;&nbsp;&nbsp;npm的项目配置文件  
|-- README.md  
