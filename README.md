wx-rss.js
====

### 概述
>一个轻量级的事件订阅器，主要解决微信小程序跨页面传参问题

### API
1.``on(name,callback,context)``

 绑定订阅

* ``name`` 必填参数，``string``类型，指定订阅的事件名称
* ``callback`` 必填参数，``function``类型，订阅事件进行响应时的回调函数
* ``context`` 可选参数，``number``类型，指定上下文，默认为0，可重复创建订阅，指定后相同context不会重复创建


2.``one(name,callback)``

 单次绑定，与``on``用法相同，但执行完``done``方法后自动清空订阅

3.``done(name,params)``

响应订阅事件，``params``作为参数返回给callback

3.``off(event_obj / event_string)`` 解除绑定

* 当``event``数据类型是``string``时，取消绑定当前所传入``event``事件名称
* 当``event``数据类型是``obj``时，取消绑定当前订阅对象

```javascript
    // 解绑方式一：只解绑当前订阅，不会取消关于名字为'a'的所有订阅
    let a = res.on('a',()=>{});
    res.off(a);

    // 解绑方式二：解绑name为'a'的所有订阅
    rss.off('a');

```
4.``clear()``

清除所有订阅事件

###使用

1.引入

``` javascript
    import rss from 'rss.js'

    // or

    const rss = require('rss.js');
```

2.例子

父页面 --A页面

``` javascript
    Page({
        /*打开页面时进行订阅*/
        onLoad(){
            rss.on('example',(req)=>{           // req 为子页面传递参数
                console.log(req.name);          // result: 'Jxz'
                console.log(req.age);           // result: 23
            });
        },
        /*关掉页面时卸载订阅*/
        onUnload(){
            rss.off('example');
        }
    })
```

子页面 --B页面

``` javascript
    Page({
        onLoad(){
            rss.done('example',{               // 响应事件，对象为返回参数
                name:'Jxz',
                age:23
            });
        }
    })
```

上述为一些简单用法，下面是一些需要注意的点

### 注意

1.如果当前父页如果是2级页面，当返回上一级时不对订阅进行``off``解绑,再次进入当前页会进行重复绑定

2.注意``onShow``等容易进行重复绑定的地方，可以考虑放在``onLoad``中绑定或用``one``方法进行单次绑定，亦或是用``on``方法中``context``参数进行指定


### 联系方式

如果你有好的意见或建议，欢迎加我的微信jin616347058,或是发送邮件到邮箱18380488848，谢谢
![QR code](http://otfhhagqp.bkt.clouddn.com/my/6BF6200F4CBDE9DB368E67F9DF342511.jpg)
