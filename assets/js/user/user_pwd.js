$(function () {
    // 1.自定义密码规则
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        newPwd: function (value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新旧密码不能一样'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '新密码两次输入不一致'
            }
        }

    })
    // 2.重置密码

    // 3.修改密码,发起post请求
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        var con = $(this).serialize();
        // 发起请求
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: con,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败')
                }
                layui.layer.msg('修改密码成功')
                $('.layui-form')[0].reset();
            }
        })
    })
    //==============有个BUG 原密码输入错误会有BUG
})