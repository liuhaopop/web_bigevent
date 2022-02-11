$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2.实现选择上传的图片
    $('#upBtn').on('click', function () {
        $('#file').click();
    })

    // 3.实现更换图片
    $('#file').on('change', function (e) {
        // console.log(e);
        var fileList = e.target.files;
        if (fileList.length === 0) {
            return layer.msg('请选择文件');
        }
        // 通过e的target的files(伪数组)属性拿到 选择的图片文件;
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 4.将图片上传到服务器,并渲染头像
    $('#upPicBtn').on('click', function () {
        // 获取到需要上传服务器的图像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 4.1 发起post更换头像请求
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) return layer.msg('上传头像失败')
                layer.msg('更新头像成功')
                // 4.2调用index页面的获取用户信息的方法,并渲染用户信息
                window.parent.getData();
            }
        })
    })
})