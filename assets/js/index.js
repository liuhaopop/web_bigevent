$(function () {
    getData();

    // 点击退出,实现退出的功能
    $('#tuichu').on('click', function () {
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function (index) {
            // 1.清除本地存储
            localStorage.removeItem('token')
            // 2.跳转到login页面
            location.href = '/login.html'
            layer.close(index);
        });
    })

})
// 1.定义一个获取用户信息的函数
function getData() {
    $.ajax({
        method: 'get',
        // 不需要写根路径,但需要在本js文件前提前导入拼接baseAPI.js文件;
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return console.log('获取信息失败' + res.message);
            }
            console.log('获取信息成功');
            // 调用渲染函数
            renderData(res.data)
        },

        // 通过complete回调函数进行判断服务器身份认证的响应是否成功;
        // 核心点:如果没有登录,服务器不会响应token => index页面去请求需要token身份认证的接口就会失败 => 达到了权限设置;
        // complete: function (res) {
        //     // console.log(res);
        //     if (res.responseJSON.status !== 0 && res.responseJSON.message !== '获取用户基本信息成功!') {
        //         // 1.清除本地存储
        //         localStorage.removeItem('token');
        //         // 2.跳转回login页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}
// 2.定义渲染用户信息的函数
function renderData(userdata) {
    // 渲染欢迎文本
    var name = userdata.nickname || userdata.username;
    $('#welcome').html('欢迎' + name)
    // 渲染图片头像
    if (userdata.user_pic !== null) {
        // 渲染图片 显示图片头像 隐藏文本头像
        $('.layui-nav-img').attr('src', userdata.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本 显示文本头像 隐藏图片头像
        $('.layui-nav-img').hide();
        $('.text-avatar').html(name[0].toUpperCase()).show();
    }

}