$(function () {
    // 1.搭建页面结构
    var form = layui.form
    var layer = layui.layer;
    // 2.声明ajax参数
    var q = {
        pagenum: 1,  // 页码
        pagesize: 3, // 每页的数据量
        cate_id: '', // 数据类型
        state: ''    // 数据状态
    }
    // 3.发起获取数据请求
    initListData()
    function initListData() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取失败')
                layer.msg('获取成功')
                // console.log(res);
                // 4.渲染页面(利用模板引擎)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    // 4.定义美化时间过滤器
    template.defaults.imports.dateFormat = function (value) {
        var time = new Date(value);
        var y = time.getFullYear()
        var m = time.getMonth() + 1;
        var d = time.getDate();

        var hh = time.getHours();
        var mm = time.getMinutes();
        var ss = time.getSeconds();

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 5.文章筛选区
    // 定义获取文章分类的ajax函数
    initcate()
    function initcate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取失败');
                layer.msg('获取成功')
                // 渲染分类下拉框
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr, '===');
                $('[name="cate_id"]').html(htmlStr)
                form.render();
            }
        })
    }

    // 定义筛选的函数
    // 思路: 分类选择好,状态选择好,点击筛选监听到form的submit事件,将这两个参数添加到参数q中,发起get请求,再渲染页面列表
    $('#filterForm').on('submit', function (e) {
        e.preventDefault();
        // 获取到文章分类
        var cate = $('[name="cate_id"]').val();
        // 获取到文章状态
        var sta = $('[name="state"]').val();
        // 补全提交参数的信息
        q.cate_id = cate;
        q.state = sta;

        // 发起get请求
        // $.ajax({
        //     method: 'get',
        //     url: '/my/article/list',
        //     data: q,
        //     success: function (res) {
        //         if (res.status !== 0) return layer.msg('获取失败');
        //         layer.msg('获取成功')
        //         // 重新渲染列表
        //         var htmlStr = template('tpl-table', res)
        //         $('tbody').html(htmlStr);
        //     }
        // })
        initListData();
    })

    // 6.定义页面分页的函数: 当页面列表数据渲染成功后,根据获取到的数据进行设置分页的配置项渲染出分页;
    function renderPage(value) {
        var laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'test1',  // 选择哪个盒子变成分页区
            count: value,   // 总共的数据
            limit: q.pagesize,  // 每页显示数量
            curr: q.pagenum,     // 起始页
            jump: function (obj, first) {  //obj 当前页的所有配置项
                // 点击对应的页码,触发这个回调函数
                // 修改提交的q参数,重新渲染列表
                q.pagenum = obj.curr;
                if (!first) {
                    initListData()
                }
            }
        });
    }

    // 7.删除数据
    // 1.点击删除按钮,发起删除请求;
    $('tbody').on('click', '#deleteBtn', function () {
        // 2.获取到数据的id值
        var id = $(this).attr('data-id')
        // 3.发起ajax删除数据请求
        $.ajax({
            method: 'get',
            url: '/my/article/delete/' + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg('删除失败');
                layer.msg('删除成功');
                // 4.重新渲染列表
                // BUG:页面最后一个删除后重新渲染的页面是空白
                // 原因:当把当前页面的数据删除完后,再请求数据时,q的pagenum依然是当前页面,所以获取到的数据时空白数据;
                // 判断当前页面的数据有无,若没有的话,pagenum减一后,再作为q的参数去发起ajax请求,再渲染页面,解决问题;

                // 思路:
                // 点击删除时需判断当前页码pagenum的页面是否还有数据,有数据的话继续使用当前的q参数进行请求ajax=>渲染;
                // 无的话需将q的pagenum的值减一,再请求ajax=>渲染

                var lists = document.querySelectorAll('#deleteBtn')
                // console.log(lists.length);
                // 判断点击删除前页面中删除按钮数量是否==1,点击后页面中无删除按钮==>即点击的是最后一条数据 ==>再次发起请求文章数据时需将pagenum - 1==>再请求==>再渲染列表

                q.pagenum = lists.length == 1 ? q.pagenum - 1 : q.pagenum
                initListData();
            }
        })

    })


})