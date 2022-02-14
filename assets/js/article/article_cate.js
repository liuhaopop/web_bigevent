$(function () {
    // 业务: 1.获取文章列表 
    var layer = layui.layer;
    var form = layui.form;
    getData()
    function getData() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败')
                layer.msg('获取文章列表成功')
                console.log(res);
                // 业务: 2.渲染页面 (模板引擎) 1引入 2定义数据 3.定义模板 4.融合 5.渲染
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
            }
        })
    }

    // 3.点击添加类别 弹出层
    var indexMsg = null
    $('#addBtn').on('click', function () {
        indexMsg = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类'
            , content: $('#msgHtml').html()
        });
    })

    // 4.发起新增分类请求
    $('body').on('submit', '.layui-form', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('提交失败')
                layer.msg('提交成功')
                getData()
                // 关闭弹出层
                layer.close(indexMsg);
            }
        })
    })

    // 5.先页面布局,点击编辑,弹出edit层
    var editIndex = null;
    $('tbody').on('click', '#editBtn', function () {
        // 1.layui布局
        editIndex = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类'
            , content: $('#editMsgHtml').html()
        });
        // 2.获取到点击的Id
        var id = $(this).attr('data-id')
        console.log(id);

        // 3.根据点击的Id项获取的信息
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取失败');
                layer.msg('获取成功')
                console.log(res);
                // 快速渲染edit的页面
                form.val('editForm', res.data)
            }
        })
        // 4.点击确认编辑发起ajax请求,并渲染页面
        $('body').on('submit', '#editForm', function (e) {
            e.preventDefault();
            // 发起ajax请求
            $.ajax({
                method: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) return layer.msg('更新失败')
                    layer.msg('更新成功')
                    layer.close(editIndex);
                    getData();
                    // BUG :成功过后 本地存储删除
                }
            })
        })
    })

    // 6.点击删除 发起删除ajax请求
    $('tbody').on('click', '#deletBtn', function () {
        var id = $(this).attr('data-id')
        // console.log(id);
        // 发起删除的ajax请求
        $.ajax({
            method: 'get',
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                console.log(res);
                getData();
            }
        })
    })
})