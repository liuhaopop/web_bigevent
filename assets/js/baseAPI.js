// 对发起ajax进行优化,避免每次发起ajax都需要填写url根路径;
// 每次发起ajax之前先执行这个js文件,对url进行拼接;
$.ajaxPrefilter(function (options) {
    // options 是ajax的配置项
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);
})