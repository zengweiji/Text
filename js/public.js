/**
 * Created by HX1501851 on 2015/10/17.
 */

/*
 *	===jw===
 *	对话框（用法$(element).JWdialog({ state: "open", success: function() { //执行内容 } })）
 *	state 打开或关闭
 *  success 点击确定执行
 */
(function ($) {
    $.fn.extend({
        Jdialog: function (param) {
            var element = this;
            var opt = $.extend({}, defaults, param);

            if (!opt.state || opt.state == "open") {
                element.open();
                element.setContent(opt);
                element.bindClick(opt);
            } else if (opt.state == "close") {
                element.close();
            }
        },
        setContent: function (param) {
            var scrop = this;
            if (param.title) {
                scrop.find(".Jdialog_content").children("h3").html(param.title);
            }
        },
        bindClick: function (param) {
            var scrop = this;

            if (scrop.find("input").length > 0) {
                scrop.find("input").siblings("span.remove").click(function () {
                    $(this).siblings("input").val("");
                });
            }

            var attr = param.submit.split(",");
            var submita = scrop.find(".Jdialog_submit").children("a");
            if (submita.length == 1) {
                submita.eq(0).addClass("big");
            }
            submita.eq(0).off("click").click(function () {
                param.cancel();
            });
            if (attr[0]) {
                submita.eq(0).html(attr[0]);
            }
            submita.eq(1).off("click").click(function () {
                param.success();
            });
            if (attr[1]) {
                submita.eq(1).html(attr[1]);
            }
        },
        open: function () {
            var scorp = this;
            scorp.addClass("animDialog");
            scorp.find("input").off("focus").focus(function () {
                $(this).parents(".dialog_main").css("vertical-align", "top");
            });
            scorp.find(".dialog_foot").children("a.cancel").off("click").click(function () {
                scorp.close();
            });
        },
        close: function () {
            this.children(".dialog_main").css("vertical-align", "middle");
            this.removeClass("animDialog");
        },
        //提示框
        Jtip: function (title, times) {
            var element = this;

            var titleTemp = title;
            var timeTemp = times || 1500;

            if (titleTemp) {
                element.find(".Jtip").children("p").html(titleTemp);
            }
            element.addClass("animDialog");
            setTimeout(function () {
                element.removeClass("animDialog");
            }, timeTemp);
        }
    });

    //默认参数
    var defaults = {
        state: 'open',
        title: '',
        submit: '',
        cancel: function () { },
        success: function () { }
    }

})(jQuery);


/**
 * 金额输入规则(保留1位小数)
 * @param obj
 */
function checkInputMoney1(obj) {
    //只能输入数字和.
    var reg = /^([0-9.]*)$/;
    if (!reg.test($(obj).val())) {
        $(obj).val('');
    }
    //保证.只出现一次，而不能出现两次以上
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    //只允许输入2位小数
    var index = obj.value.indexOf('.');
    if (index > 0) {
        //小数点后第2位不能为0
        if (obj.value.substring(index + 1, index + 2) == 0) {
            obj.value = obj.value.substring(0, index + 1);
        }
        if (obj.value.length > index + 2)
            obj.value = obj.value.substring(0, index + 2);
    }
    //以0开头必须为小数
    if (obj.value.length > 1) {
        if (obj.value.substring(0, 1) == 0 && obj.value.substring(1, 2) != ".") {
            $(obj).val('');
        }
    }
}

/**
 * 金额输入规则(保留2位小数)
 * @param obj
 */
function checkInputMoney2(obj) {
    //只能输入数字和.
    var reg = /^([0-9.]*)$/;
    if (!reg.test($(obj).val())) {
        $(obj).val('');
    }
    //保证.只出现一次，而不能出现两次以上
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    //只允许输入2位小数
    var index = obj.value.indexOf('.');
    if (index > 0) {
        //小数点后第2位不能为0
        if (obj.value.substring(index + 2, index + 3) == 0) {
            obj.value = obj.value.substring(0, index + 2);
        }
        if (obj.value.length > index + 3)
            obj.value = obj.value.substring(0, index + 3);
    }
    //以0开头必须为小数
    if (obj.value.length > 1) {
        if (obj.value.substring(0, 1) == 0 && obj.value.substring(1, 2) != ".") {
            $(obj).val('');
        }
    }
}