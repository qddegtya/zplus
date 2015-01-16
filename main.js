/**
 * Created by archer on 15/1/9.
 * main
 */

(function($){

    $("#z_slider").zSlider({
        //Banner图片列表
        "bannerList": [
            "http://xmsj.qiniudn.com/mobile/index/banner/1420253131197.png",
            "http://xmsj.qiniudn.com/mobile/index/banner/1415961765773.png",
            "http://xmsj.qiniudn.com/mobile/index/banner/1416028453279.png"
        ],
        "dragEnable": true,  //是否支持拖拽
        "speed": 3000,  //轮播速度
        "autoPlay": true  //是否自动轮播
    });

}(Zepto));