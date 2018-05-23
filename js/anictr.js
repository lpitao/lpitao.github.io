//1,自调用匿名函数
//2,删除掉之前class选择器,添加新的选择器,实现方法:利用数组,
//3,js写的removeClass方法

/*
1,自调用匿名函数
(function() {
var jQuery = ...
// ...
})();
通过创建一个自调用匿名函数，创建了一个特殊的函数作用域，该作用域中的代码不
会和已有的同名函数、方法和变量以及第三方库冲突。

2,通过手动把变量jQuery 添加到window 对象上
(function() {
var jQuery = ...
// ...
window.jQuery = window.$ = jQuery;
})();
明确地使变量jQuery 成为公开的全局变量，而其他的部分将是私有的。

3,通过传入window 对象
(function( window, undefined ) {
var jQuery = ...
// ...
window.jQuery = window.$ = jQuery;
})(window);
可以使window 对象变为局部变量（即把函数参数作为局部变量使用），这样当在jQuery 代码块中访问window 对象时，不需要将作用域链回退到顶
层作用域，从而可以更快地访问window 对象;另外，将window 对象作为参数传入，可以在压缩代码时进行优化面的代码.
*/

(function(win){

    var eleArr = [];

    var Anictr = function(opts){
        this.ele = opts.ele;
        this.ani = opts.ani;
        this.dur = opts.dur;
        this.tim = opts.tim;
		
        if(opts.before){
            this.before = opts.before;
        }
        if(opts.after){
            this.after = opts.after;
        }
        if(opts.rani){
            this.rani = opts.rani;
        }
    };

    Anictr.prototype = {
        go: function(){
            var self = this;
            var ele = document.querySelector(self.ele);

            if(self.before){
                self.before(self)
            }
            if(self.after){
                setTimeout(function(){
                    self.after(self)
                },self.dur)
            }
            //动画改变程度：动画时长
            if(self.dur){
                var second = self.dur /1000 + 's';
                ele.style.cssText += ';animation-duration:' + second + ';-webkit-animation-duration:' + second;
            }
            //动画改变程度：动画速度
            if(self.tim){
                ele.style.cssText += ';animation-timing-function:' + self.tim + ';-webkit-animation-timing-function:' + self.tim;
            }
            //比较上一次对象id和这一次对象id是否相同,相同id则删除:避免元素加上在有前一个class选择器的情况下再加class选择器
            if(eleArr.length > 0){
                for(var k = 0; k < eleArr.length; k++){
                    if(ele === eleArr[k].ele ){
                        removeClass(ele,eleArr[k].ani);//把上一个加在此元素上的class选择器去掉
                        eleArr.splice(k,1);
                    }
                }
            }
		    //  把上一次元素id,和元素所要执行的动画压入数组中：目的可以在多重叠加的情况下，删除上一次对相同元素的操作。
            eleArr.push({ele:ele,ani:self.ani});
            
            if(/animated/.test(ele.className)){
                ele.className +=  ' ' + self.ani;
            }else{
                ele.className += ' animated ' + self.ani;
                ele.className = ele.className.trim();
            }
            return self;
        },
        then: function(obj,timeDelay){
            var self = this;
            var ele = document.querySelector(self.ele);
            
            //then参数可以是多个对象组成的数组
            setTimeout(function(){
                obj.go.call(obj);//obj.go来替换 obj
            },timeDelay);

            return obj;
        }
    };

    function removeClass(ele, oldClass){
        var classNames = ele.className.trim();
        classNames = classNames.replace(/\s+/g,' ');
        var classNameArr = classNames.split(' ');
        for(var j = 0; j<classNameArr.length; j++){
            if(oldClass === classNameArr[j]){
                classNameArr.splice(j,1)
            }
        }
        return ele.className = classNameArr.join(' ');
    }


    var anictr = function(opts){
        return new Anictr(opts)
    }
    win.anictr = anictr;
})(window,undefined);
