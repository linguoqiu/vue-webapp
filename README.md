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

|-- build   webpack的配置文件，包括基础，开发环境，生产环境  
|-- config  环境的配置文件  
|-- node_modules    项目的依赖包，自动生成  
|-- src     项目源代码  
  |-- api     存放一些配置文件，请求后台的方法  
  |-- assets  存放图片等资源  
  |-- base    存放一些通用的vue组件  
  |-- common  存放一些通用的js，fonts，css，image，可以在其他地方直接引用  
  |-- components  此目录下按不同的页面存放不同的vue组件  
  |-- router      项目的路由配置文件  
  |-- App.vue     vue入口文件  
  |-- main.js     js入口文件，并初始化部分参数  
|-- static  打包后的静态文件  
|-- .babelrc    babel的设置  
|-- .editorconfig   编译器的设置  
|-- eslintignore    eslint的设置  
|-- eslintrc.js  
|-- gitignore   
|-- .postcssrc.js   
|-- index.html      html的入口文件  
|-- package.json    npm的项目配置文件  
|-- README.md  