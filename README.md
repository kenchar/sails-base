# sails-base

sails1.0+扩展基础包，包含用户体系权限校验及model的attr，action的inputs入参提示语自定义功能

## Installation
```sh
$ npm install --save sails-base sails-hook-violations
```

## Usage

### model
#### User.js
``` js
var _super = require('sails-base/api/models/User');

_.merge(exports, _super, {

});

```
#### Passport.js
``` js
var _super = require('sails-base/api/models/Passport');

_.merge(exports, _super, {

});

```

### 创建本地账号
``` js
访问路由：post /user/register
参数：{
  identifier: '用户名或者邮箱地址均可',
  password: '密码，密码长度不可小于8个字符'
}
```

### 本地账号登录
``` js
访问路由：post /auth/local
参数：{
  identifier: '用户名或者邮箱地址均可',
  password: '密码，密码长度不可小于8个字符'
}
```

### 第三方授权登录
* 引入第三方passport
``` sh
npm install passport-wechat-api --save
```
* 引入第三方配置信息，如passport-wechat-api([微信开发平台/小程序登录](https://github.com/kenchar/passport-wechat-api) )配置如下：
```js
module.exports.custom = {

  passport: {
    wechat: {
      name: 'wechat',
      protocol: 'oauth',
      strategy: require('passport-wechat-api').Strategy,
      options: {
        appID: 'wx7b........',
        appSecret: 'bd4f8.........'
      },
      callback: async function (req, accessToken, refreshToken, profile, result, done) {
        try {
          //重要步骤，用于存储用户授权登录信息
          let passport = await sails.helpers.passportUserRefBuild.with({
            protocol: 'oauth',
            provider: 'wechat',
            accessToken: accessToken,
            identifier: profile.openid,
          });
          sails.log.error(passport);
          done(null, passport);
        } catch (e) {
          done(e.message);
        }
      }
    },
    miniProgram: {
      name: 'miniProgram',
      ...
      options: {
        ...
        isMiniProgram: true
      }
    }
  }

}
```
* 授权登录
```
get /auth/wechat?code=xxx
```

### 入参校验

+ 参考[attributes/inputs的入参校验提示语自定义](https://github.com/kenchar/sails-hook-violations)

### 开启http请求日志
```js
  //in config/http.js
  params: {
    debug: true //debug模式下，打印请求参数及返回主体
  }
```

### action自动填充创建/更新人信息
#### config/policies.js
```js
'story/create': ['is-logged-in','set-create-or-update-user']
```

#### api/controllers/story/create
```js
const _super = require('sails-base/api/controllers/base-action');

_.merge(exports, _super, {
    friendlyName: 'create',
    descripiton: 'create story',
    inputs: {},
    ...
});
```

## Licence

The MIT License (MIT)

Copyright (c) 2019 追疯

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
