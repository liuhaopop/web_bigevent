$(function () {
    // 1.自定义input的验证规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度1 ~ 6位'
            }
        }
    })

    var layer = layui.layer
    initUserData()  //调用
    // 2.初始化用户信息
    function initUserData() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败' + res.message)
                }
                console.log('获取用户信息成功');
                console.log(res);
                // 3.快速给表单赋值
                form.val('userData', res.data)
            }
        })
    }

    // 4.点击重置按钮 => 阻止默认重置 => 调用初始化用户信息;
    $('#resetBtn').on('click', function (e) {
        e.preventDefault();
        initUserData()
    })

    // 5.更新用户的基本信息
    // 点击提交 => 触发form的submit事件,form收集 => post请求(服务器的用户信息更新) => 再调用index的get请求,在渲染页面;
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 发起post提交(修改服务器的数据)
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新信息失败')
                }
                layer.msg('更新信息成功')
                // 子页面调用父页面的方法,使用window.parent.方法();
                window.parent.getData();
            }
        })
    })
})