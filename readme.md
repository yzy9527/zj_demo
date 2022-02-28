### 专辑问题整合

1. 对于图片标题可使用图片加文字一起使用，图片显示，文字使用text-indent：-9999px隐藏，方便seo

2. 原网站使用尺寸为1000 * 585，为适应气大小，有两种方法；
- 原来使用是将body下的div 设置为绝对定位；
- body设置980*565，平台会加上20px

3. 在连续播放视频场景中，在调用play方法后，再去监听ended时，如果没有在ended时off掉on方法，那么在ended后播放下一个视频时调用play时，会调用两次ended视频（包含上一次的监听）

4. html页面播放视频时，需要把不需要的div块隐藏。否则在ios中全屏播放时视频会向下偏移，布局问题

5. 循环点击时加上unbind() 防止点击一次调用多次

6. qq浏览器最后2秒停止播放，qqHD bug

7. uc移动端播放完视频后播放音频，音频无法播放。移动端禁止视频自动播放，在模块一进入按钮调用一次音频播放，src为空的音频MP3

8. iframe内video标签视频无法全屏
   iframe默认不允许全屏, 如果内嵌了video那么控制条上将不显示全屏按钮, 通过添加allowfullscreen属性可以开启全屏功能

9. audio play报错
   错误发生的过程为：
- media.play() 开始异步加载video/audio内容。
- media.pause() 在video/audio没有准备好时中断加载。
- media.play() 此时进行继续播放，报错。

原因：
从Chrome50开始，对`<video>`或`<audio>`元素的`play()`调用返回一个`Promise`。
      一个异步返回单个结果的函数。如果回放成功，`Promise`就会实现，而`play`事件也会同时触发，对应执行`.then`。
      如果回放失败，`Promise`将被拒绝，同时会有一个错误消息解释失败，对应执行`.catch`。

解决方法：

```js	
audio.load()
let playPromise = audio.play()
if (playPromise !== undefined) {
    playPromise.then(() => {
        audio.play()
    }).catch(()=> {
      
    })
}
```

8. 监听后需移除
```js
$('#video').on('ended',function(){
                     $('#video').css('visibility','visible');
                     $('#video').off('ended');
                     selectvideo();
              })
```

9. 视频未加载完成就开始播放，报错

解决方法：

```js
    var video = document.getElementById("xdd-t-2018_html5_api");
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(function()  {
                t.play()
            }).catch(function(err) {
               console.log('err')
            })
        }
```

10. video.js版本问题

11. videojs IE10报错，版本问题
    采用小高 videojs 5.9.2

12. 移动端禁止img点击放大
    pointer-events: none;

13. 专辑uc ipad图片不显示
    原因：图片太大导致
    将原图片大小为2567*1823改为1024*768

14. uc浏览器播放兼容性
- ipad 11.1.1  播放按钮可点击
- ipad 12 13 播放按钮不可点击，需要调用play()方法

15. uc浏览器全屏后无法退出全屏

```js
//修复uc浏览器使用被劫持的全屏方法播放视频后不能自动退出全屏
    if (navigator.userAgent.indexOf('UCBrowser')!= -1) {
        document.getElementsByTagName('video')[0].webkitExitFullScreen()
    }
```

16. qq浏览器问题提前两秒结束
相同方法导出的两个MP4视频，在qq ios浏览器中
- 一个会正常播放，
- 一个会在提前两秒结束
    经测试，播放爱奇艺等网站视频也会出现这个情况；估计是浏览器bug

17. qq浏览器视频劫持问题
视频加载之后会被播放会被浏览器劫持，导致的问题是结束会播放广告退不出来，经过不断调试操作，有以下两个方法：
- 在window.onload后动态创建video标签
- setTimerOut方法定个800毫秒（大概时间），之后再创建video对象，神奇的是就不会被劫持了

18. safair视频向下偏移
    原因：dom布局导致：video播放时，没有隐藏之前的div页面

推荐将body子元素设置为两个：video 和div ；在video播放时，隐藏其他全部的div,防止因为dom问题引发的一系列bug：如视频偏移

19. ipad safari videojs 竖屏全屏播放显示不全（没有自适应宽度）
    可能原因：2层iframe嵌套和videojs在safari中有兼容性问题
    现象：
- 去除第二个iframe的所有同级标签，并将body的宽度改为1000px（和父级同宽），非正常全屏
- 去除第二个iframe的所有同级标签，并将body的宽度改为100%（第一个iframe宽为1000px），可正常全屏；
- 给第二个iframe设一个同级div，将body的宽度改为100%，div宽度若超过ipad屏幕宽度，则非正常全屏；反之可正常全屏；

解决方法：
在ipad Safari中，html中将iframe和其它dom分开，视频全屏播放后，隐藏其余dom；退出全屏，显示dom
