// 对每次ajax的请求的配置项options进行处理 优化;
$.ajaxPrefilter(function (options) {
    // 对发起ajax进行优化,避免每次发起ajax都需要填写url根路径;
    // 每次发起ajax之前先执行这个js文件,对url进行拼接;
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);


    // 每次发起ajax请求前给需要身份认证的请求添加headers配置项
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局的ajax请求都挂上一个complete函数用来判断 是否有权限
    options.complete = function (res) {
        if (res.responseJSON.status !== 0 && res.responseJSON.message !== '获取用户基本信息成功!') {
            // 1.清除本地存储
            localStorage.removeItem('token');
            // 2.跳转回login页面
            location.href = '/login.html'
        }
    }
})