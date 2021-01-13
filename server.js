const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 8080;
app.use(express.static('dist/ngs-wyy'));

// 旧版本写法 路径以 '/api' 的配置
//  const apiProxy = proxy('/api/**', {
//   target: "http://localhost:3000",
//   changeOrigin: true,
//   pathRewrite: {
//     "^/api": ""
//   }
// }); 

// 旧版本写法 路径以 '/' 的配置
// const apiProxy = proxy('/**', {
//   target: "http://localhost:3000",
//   changeOrigin: true
// });
app.use('/api/**',createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
    pathRewrite: {
      "^/api": ""
    }
}));
app.listen(PORT, function(err) {
  if (err) {
    console.log('err :', err);
  } else {
    console.log('Listen at http://localhost:' + PORT);
  }
});