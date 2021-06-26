# vscode.extensions
vscode extensions
https://code.visualstudio.com/api

## Get Started
```
npm install -g yo generator-code

yo code
```

## Publishing
```
npm install -g vsce

vsce package

vsce publish
```

## npm

安装但不写入package.json；
npm install xxx

安装并写入package.json的"dependencies"中 （--save）
npm install axios -S 

安装并写入package.json的"devDependencies"中（--save-dev）
npm install xxx -D

全局安装
npm install xxx -g

安装指定版本
npm install xxx@1.2.0

检查更新，可以看到所有可以更新的模块。
npm outdated

更新但不写入package.json；（其它的同上）
npm update xxx

删除指定模块；
npm uninstall crawler 

删除全局模块
npm uninstall -g xxx

查看全局安装的包
npm list -g --depth 0
