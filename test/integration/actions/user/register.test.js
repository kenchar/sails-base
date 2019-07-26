/**
 * @Filename register.test.js
 * @Description 注册测试
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019-07-23
 */
const assert = require('power-assert');
const request = require('supertest');
const _ = require('lodash');

describe('#user.register()', () => {

  let agent;
  let modelVM;
  let actionDef;
  let actionVM;
  const failedStatusCode = 500;
  const reqPath = '/user/register';

  before(async () => {
    modelVM = User.violationMessages;
    actionDef = await sails.helpers.getActionModelByPath(reqPath);
    actionVM = actionDef.violationMessages;
    agent = request.agent(sails.hooks.http.app);
  });


  describe('#本地账号注册Success.', () => {

    it('本地邮箱账号注册Success.', done => {
      //do something
      request(sails.hooks.http.app)
        .post(reqPath)
        .send({
          identifier: 'test1@seekow.com',
          password: 'test123456'
        })
        .expect(200, done);
    });

    it('本地用户名账号注册Success.', done => {
      //do something
      request(sails.hooks.http.app)
        .post(reqPath)
        .send({
          identifier: 'jclv',
          password: 'test123456'
        })
        .expect(200, done);
    });
  });

  describe('#本地账号注册Failed.', () => {

    it('邮箱地址已被使用.', done => {
      request(sails.hooks.http.app)
        .post(reqPath)
        .send({
          identifier: 'test@seekow.com',
          password: 'test123456'
        })
        .expect(failedStatusCode)
        .end((err, res) => {
          if (err) return done(err);
          //是否等于自定义的错误信息
          assert.equal(modelVM.email.unique, res.body.message);
          done();
        });
    });

    it('用户名已被使用.', done => {
      request(sails.hooks.http.app)
        .post(reqPath)
        .send({
          identifier: 'test',
          password: 'test123456'
        })
        .expect(failedStatusCode)
        .end((err, res) => {
          if (err) return done(err);
          //是否等于自定义的错误信息
          assert.equal(modelVM.username.unique, res.body.message);
          done();
        });
    });

    it('注册账号为空.', done => {
      request(sails.hooks.http.app)
        .post(reqPath)
        .send({
          password: 'test123456'
        })
        .expect(failedStatusCode)
        .end((err, res) => {
          if (err) return done(err);
          //是否等于自定义的错误信息
          assert.equal(actionVM.identifier.required, res.body.message);
          done();
        });
    });

    it('密码强度太低.', done => {
      request(sails.hooks.http.app)
        .post(reqPath)
        .send({
          identifier: 'test2@seekow.com',
          password: 'test'
        })
        .expect(failedStatusCode)
        .end((err, res) => {
          if (err) return done(err);
          //是否等于自定义的错误信息
          assert.equal(actionVM.password.minLength, res.body.message);
          done();
        });
    });

  });

});
