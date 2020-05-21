#####对于图片标题可使用图片加文字一起使用，图片显示，文字使用text-indent：-9999px隐藏，方便seo
##### 尺寸
原网站使用尺寸为1000*585，为适应气大小，有两种方法；
1.原来使用是将body下的div 设置为绝对定位；
2.body设置980*565，平台会加上20px

移动端禁止img点击放大
pointer-events: none;


专辑uc ipad图片不显示
原图片大小为2567*1823改为1024*768 

flex在ie.下 竖排无法实现
https://www.cnblogs.com/dodocie/p/7137314.html

ul li decimal数字2位于右侧
设置float=“left”


jquery attr prop
http://www.fly63.com/article/detial/479

#####uc浏览器播放兼容性
 ipad 11.1.1  播放按钮可点击
ipad 12 13 播放按钮不可点击，需要调用play()方法
———
//修复uc浏览器使用被劫持的全屏方法播放视频后不能自动退出全屏
    if (navigator.userAgent.indexOf('UCBrowser')!= -1) {
        document.getElementsByTagName('video')[0].webkitExitFullScreen()
    }
———

#####qq浏览器问题
相同方法的导出的两个MP4视频，在qq ios浏览器中
	一个会正常播放，
	一个会在提前两秒结束
经测试，播放爱奇艺等网站视频也会出现这个情况；
视频劫持问题：
	防劫持：  1.在window.onload后动态创建video标签
			2.setTimerOut方法定个800毫秒，之后再创建video对象

———
#####safair视频向下偏移
dom布局导致：video播放时，没有隐藏之前的div页面
推荐将body子元素设置为两个：video 和div ；在video播放时，隐藏其他全部的div,防止因为dom问题引发的一系列bug：如视频偏移


####ipad 12 safari video播放无法全屏，平台可全屏

###ipad safari videojs 竖屏全屏播放显示不全（没有自适应宽度）
可能原因：2层iframe嵌套和videojs在safari中有兼容性问题
现象： 
 - 去除第二个iframe的所有同级标签，并将body的宽度改为1000px（和父级同宽），非正常全屏
 - 去除第二个iframe的所有同级标签，并将body的宽度改为100%（第一个iframe宽为1000px），可正常全屏；
 - 给第二个iframe设一个同级div，将body的宽度改为100%，div宽度若超过ipad屏幕宽度，则非正常全屏；反之可正常全屏；

解决: 在ipad Safari中，html中将iframe和其它dom分开，视频全屏播放后，隐藏其余dom；退出全屏，显示dom
