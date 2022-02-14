$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 1.动态获取 文章类别,并渲染页面
    getCate()
    function getCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取类别失败');
                }
                layer.msg('获取类别成功');
                console.log(res);
                // 渲染页面(模板引擎)
                var htmlStr = template('tpl-select', res)
                // console.log(htmlStr);
                $('[name="cate_id"]').html(htmlStr);
                // 表单标签动态渲染时,form无法自动渲染显示,需要form手动渲染显示
                form.render();
            }
        })
    }
    // 实现富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 点击选择封面 弹出图片文件选择
    $('#selectPic').on('click', function () {
        $('#file').click();
    })
    // 为文件选择框绑定change事件,当input里的文件有变动,执行回调函数,更新图片
    $('#file').on('change', function (e) {
        var files = e.target.files[0]
        var newImgURL = URL.createObjectURL(files)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 发布文章: 1.基于form生成formData管理数据,2.手动添加state和cover_img属性,3.发起ajax请求;
    // *定义state参数
    var state_art = '已发布';
    $('#saveDraft').on('click', function () {
        state_art = '草稿';
    })
    // 监听form的submit事件
    $('#form-data').on('submit', function (e) {
        e.preventDefault();
        // *定义上传的参数
        var fd = new FormData($(this)[0])
        fd.append('state', state_art)
        // *定义封面参数
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发起ajax请求: blob是在局部作用域内,不能被外部调用,所以需要在blob的作用域调用ajax请求
                articlePub(fd);
            })
    })

    // 定义ajax请求
    function articlePub(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.msg('失败')
                layer.msg('成功')
            }
        })
    }
})