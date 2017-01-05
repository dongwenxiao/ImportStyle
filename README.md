# ImportStyle

React 组件添加样式，目的：加载一次、先加载样式再显示组件、样式跟随组件存在、css书写原生(Less\Sass均可)。

> ImportStyle - 普通组件使用

> ImportStyleRoot - 最外层组件使用

注意: 每个组件最外层的class名必须是 .component,在webpack的wrapper-css-loader处理后变成md5的class名。

## 使用

配合 [wrapper-css-loader](https://github.com/dongwenxiao/wrapper-css-loader) 使用