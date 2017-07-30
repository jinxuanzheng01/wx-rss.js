module.exports = new class Rss{
    // 缓存事件对象
    _storeObj = {};

    /** 绑定订阅
     *
     * @param name       -> String      属性名
     * @param callback   -> Function    回调
     * @param context    -> Number      指定订阅刊号
     *
     * 描述：作为一个中间件传递修正后的参数到 this._bind 中
     */
    on(name,callback,context){

        if (context === 0) throw new Error('Subscription: 参数context不能等于0;');
        !context ? context = 0 : '';

        return this._bind(name,callback,context,0);
    };

    /** 绑定订阅 --响应一次后删除该事件
     *
     * @param name        -> String      属性名
     * @param callback    -> Function    回调
     */
    one(name,callback){
        return this._bind(name,callback,0,1);
    }

    /** 解除订阅
     *
     * @param name
     *
     * -> String   属性名
     * 描述: 从对象集合中删除该属性名
     *
     * -> Object   当前事件对象
     *    - name: 属性名
     *    - sort: 事件在订阅集合中的下标
     * 描述: 删除适配当前参数的属性中的事件
     */
    off(name){
        let _storeObj = this._storeObj;

        if(typeof name === 'string'){
            delete _storeObj[name];
        }else if(typeof name === 'object'){
            delete _storeObj[name.name][name.sort];
            if (_storeObj[name.name].length <= 1)delete _storeObj[name.name];
        }
    };

    /** 进行订阅反馈
     *
     * @param name       -> String    属性名
     * @param params     -> *         反馈的参数
     *
     * 描述: 订阅反馈，进行回调
     */
    done(name,params){
        let _storeObj = this._storeObj;
        this._each(_storeObj[name],(key,current)=>{
            current.cb(params);
            current.type === 1 && this.off(name);
        });
    };

    /** 清除所有缓存订阅
     *
     *  描述: ...
     **/
    clear(){
        this._storeObj = {};
    }

    /** 遍历事件集合(属性私有，不可调用)
     *
     * @param obj          -> Object        存储的订阅对象
     * @param callback     -> Function      订阅对象的事件回调
     *
     */
    _each(obj,callback){
        for (let key in obj) {
            if (obj[key] && key !== 'length') callback(key,obj[key]);
        }
    };

    /** 绑定订阅(属性私有，不可调用)
     *
     * @param name         -> String                    名称
     * @param callback     -> Function                  回调
     * @param context      -> Number                    订阅指定序号
     * @param type         -> Number {0:'on',1:'one}    订阅类型
     * @returns {*}        -> Object                    订阅状态对象
     *
     */
    _bind(name,callback,context,type){
        // 参数类型判断
        if (typeof name !== 'string' || typeof callback !== 'function') {
            throw new Error('Subscription:参数类型错误，请确认后重试');
        }

        // 变量声明
        let _storeObj = this._storeObj,              // 缓存全部对象
            _currentObj = _storeObj[name],           // 当前对象
            _count = 0;                              // 计数

        // 缓存中该无对象操作
        if (!_currentObj) {
            _currentObj = _storeObj[name] = {};
        }

        // 分类判定
        let sort = _storeObj[name].length,
            juge = true;

        // 判断是否含有该属性
        for (let i in _storeObj[name]){
            !! _storeObj[name][i].context && _storeObj[name][i].context === context ? juge = false : '';
        }

        if (context !== 0 && !!sort && juge === false){
            return {name:name,sort:sort};
        }

        // 计数赋值
        _count = _currentObj['length'] ? ++_currentObj['length'] : ++ _count;

        // 存对象
        _storeObj[name][_count] = {cb:callback,context:context,type:type};
        _storeObj[name]['length'] = _count;

        // 返回索引
        return {name:name,sort:_count}
    }

}();