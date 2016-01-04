/**
 * Created by archer on 15/1/9.
 * zSlider
 */

(function($){

    'use strict';

    // 检查插件环境
    if(typeof Zepto === "undefined") { throw new Error("请引入zepto"); }

    var options = {};
    var self;
    var screenWidth; // 屏幕宽度px值，用于样式调整
    var zContainer; // 主容器
    var currentBannerIndex = 0; // 容器一开始所在位置
    var screenWidthNum;  // 屏幕宽度int值,用于计算
    var originX; // 记录手指初始坐标
    var isToLeft; // 记录向左滑动还是向右滑动
    var currentBanner; // 手指当前banner
    var globalTimer; // 全局定时器
    var currentTimer = 0; // 当前定时器指针

    $.fn.zSlider = function(userOptions){
        options = $.extend({}, $.fn.zSlider._initialOptions, userOptions);
        // 绑定调用者
        self = this;
        $.fn.zSlider.init();
    };

    // 初始化配置
    $.fn.zSlider._initialOptions = {
        "bannerPreImg" : "", // Banner默认占位图
        "hasControl": true, // 默认生成控制器
        "speed" : 2, // 播放速度
        "bannerList" :[] // banner列表
    };

    $.fn.zSlider.init = function(){

        // 获取屏幕宽度
        screenWidthNum = $(window).width();
        screenWidth = $(window).width() + "px";

        // 获取百分比宽度基数
        var _perW = options.bannerList.length;

        // 设置宽度
        self.css({width: _perW * 100 + "%"});

        // 装载,并初始化宽度
        $.each(options.bannerList, function(index, imgUrl){

            var _li = document.createElement("li");
            _li.style.width = screenWidth;
            _li.className = "banner_main_li";


            var _img = document.createElement("img");
            _img.src = imgUrl;
            _img.dataset.bannerIndex = index;

            _li.appendChild(_img);
            self.append(_li);

        });

        // 显示控制条
        if(options.hasControl || false){

            var _controlP = document.createElement("ul");
            _controlP.className = "z_slider_nav";
            _controlP.id = "z_slider_nav";
            _controlP.style.width = screenWidth;

            $.each(options.bannerList, function(index){

                var _li = document.createElement("li");
                _li.className = "z_slider_li";
                _li.dataset.navIndex = index; //将navIndex塞入,用于后续处理
                _li.style.width = (1 / options.bannerList.length) * 100 + "%";

                // 如果等于当前序号，则添加样式
                if(index === currentBannerIndex){
                    $(_li).addClass("currentNav");
                }

                _controlP.appendChild(_li);

            });

            // 控制区域需要添加到主容器
            zContainer = $("#z_slider_container");
            zContainer.append(_controlP);

            // 控制条处理
            $(".z_slider_li").on("click", function(e){

                // 计算需要的位移
                var _m = parseInt($(this).attr("data-nav-index"));
                var _transOffset = 0 - (_m * screenWidthNum);

                // 加入动画
                self.css({
                    "-webkit-transition": "transform 0.4s",
                    "-moz-transition": "transform 0.4s",
                    "-ms-transition": "transform 0.4s",
                    "-o-transition": "transform 0.4s",
                    "transition": "transform 0.4s"
                });

                // 处理3d滑动
                zTranslate3d(self, _transOffset);

                // 处理样式
                $(this).addClass("currentNav");
                $(this).siblings().removeClass("currentNav");

            });

        }

        // 定时自动滑动
        if(options.autoPlay && true){
            (function(c, l){

                // 加入动画
                self.css({
                    "-webkit-transition": "transform 0.4s",
                    "-moz-transition": "transform 0.4s",
                    "-ms-transition": "transform 0.4s",
                    "-o-transition": "transform 0.4s",
                    "transition": "transform 0.4s"
                });

                globalTimer = setInterval(function(){
                    zTranslate3d(self, 0 - c * screenWidthNum);

                    // 处理nav
                    $($(".z_slider_li")[c]).addClass("currentNav");
                    $($(".z_slider_li")[c]).siblings().removeClass("currentNav");

                    if(c < l - 1){
                        c += 1;
                    } else if(c === l - 1){
                        //重置
                        c = 0;
                    }

                }, options.speed || 3000);

            }(currentTimer, options.bannerList.length));
        }

        // 绑定触摸事件流
        self.on("touchstart", zTouchHandlerStart);
        self.on("touchmove", zTouchHandlerMove);
        self.on("touchend", zTouchHandlerEnd);

    };


    // 手指开始放到屏幕上
    function zTouchHandlerStart(e){
        e.preventDefault();

        // 保证只有一个触点
        if(e.targetTouches.length > 1 || e.touches.length > 1){
            return;
        }

        currentBanner = e.target;
        currentBannerIndex = parseInt($(currentBanner).attr("data-banner-index"));

        // 保存初始值
        originX = e.targetTouches[e.targetTouches.length - 1].screenX;

    }

    // 手指开始移动
    function zTouchHandlerMove(e){

        e.preventDefault();

        // 清除转场动画
        self.css({
            "-webkit-transition": ""
        });

        // 左滑还是右滑用于离开时做响应
        if(e.changedTouches[e.changedTouches.length - 1].screenX > originX){
            isToLeft = false;
        } else if(e.changedTouches[e.changedTouches.length - 1].screenX < originX){
            isToLeft =  true;
        }


        // 是否开启拖拽
        if(options.dragEnable){

            if(isToLeft){
                if(currentBannerIndex !== options.bannerList.length - 1){
                    zTranslate3d(self, (0 - currentBannerIndex * screenWidthNum) + (e.targetTouches[0].screenX - originX));
                }
            } else {
                if(currentBannerIndex !== 0 ){
                    zTranslate3d(self, (0 - currentBannerIndex * screenWidthNum) + (e.targetTouches[0].screenX - originX));
                }
            }

        }


    }


    // 手指离开屏幕时的响应
    function zTouchHandlerEnd(e){

        e.preventDefault();

        // 加入动画
        self.css({
            "-webkit-transition": "transform 0.4s",
            "-moz-transition": "transform 0.4s",
            "-ms-transition": "transform 0.4s",
            "-o-transition": "transform 0.4s",
            "transition": "transform 0.4s"
        });

        if(e.changedTouches[0].screenX === originX){
            // 这是一次tap事件
            return;
        }

        if(isToLeft){
            if(currentBannerIndex !== options.bannerList.length - 1){
                zTranslate3d(self, 0 - (currentBannerIndex + 1) * screenWidthNum);
            }

            // 处理nav
            $($(".z_slider_li")[currentBannerIndex + 1]).addClass("currentNav");
            $($(".z_slider_li")[currentBannerIndex + 1]).siblings().removeClass("currentNav");

        } else {
            if(currentBannerIndex !== 0 ){
                zTranslate3d(self, 0 - (currentBannerIndex - 1) * screenWidthNum);
            }

            // 处理nav
            $($(".z_slider_li")[currentBannerIndex - 1]).addClass("currentNav");
            $($(".z_slider_li")[currentBannerIndex - 1]).siblings().removeClass("currentNav");
        }
    }


    // translate3D,用于banner整体移位动画
    function zTranslate3d(ele, offset){
        $(ele).css({
            "-webkit-transform": "translate3d(" + offset + "px, 0, 0)"
        });
    }

}(Zepto));
