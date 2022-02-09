$(function () {
    // 登录/注册页面的显示隐藏的切换
    $('.logAndRegBox #link_Reg').on('click', function () {
        $('.logAndRegBox .login-Box').hide()
        $('.logAndRegBox .Reg-Box').show();
    })
    $('.logAndRegBox #link_Login').on('click', function () {
        $('.logAndRegBox .login-Box').show()
        $('.logAndRegBox .Reg-Box').hide();
    })

    //自定义表单校验规则
    // 1.从layui上获得form
    var form = layui.form
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 密码确认规则
        repwd: function (value) {
            // value的值是repassword的值和password的值进行对比
            if ($('.Reg-Box [name="password"]').val() !== value) {
                return '两次输入密码不一致'
            }
        }
    })

    // 从layui上获得layer
    var layer = layui.layer
    // 2.注册,监听form的submit事件,再进行发起ajax请求
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 快速获取form中的input的键值对
        var con = $(this).serialize();
        // 发起ajax请求
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: con,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录')
                $('.logAndRegBox #link_Login').click();
            }
        })
    })

    // 3.登录,监听form的submit,发起ajax请求;
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 快速获取form中的input的键值对
        var con = $(this).serialize();
        // 发起ajax请求
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: con,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                // 将身份认证放入本地存储
                localStorage.setItem('token', res.token)
                // 跳转到index主页
                location.href = '/index.html'
            }
        })
    })

})