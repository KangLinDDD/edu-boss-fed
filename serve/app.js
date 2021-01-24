const express = require('express')
const app = express()
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')
// 托管了 dist 目录，当访问/得时候，默认会返回托管目录中得 index.html
app.use(express.static(path.join(__dirname, '../dist')))
app.get('/', (req, res) => {
    res.send('hello')
})
app.use('/boss', createProxyMiddleware({
    target: 'http://eduboss.lagou.com',
    changeOrigin: true
}))
app.use('/front', createProxyMiddleware({
    target: 'http://edufront.lagou.com',
    changeOrigin: true
}))
app.listen(3000, () => {
    console.log('running...')
})