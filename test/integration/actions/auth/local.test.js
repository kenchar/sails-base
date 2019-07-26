/**
 * @Filename local.test.js
 * @Description 本地账号登录
 * @author kenchar (kenchar.lv@gmail.com)
 * @date 2019-07-23
 */
const assert = require('power-assert');
const request = require('supertest');
const _ = require('lodash');

describe('#auth.local()', () => {

    let agent;
    let actionObj;
    const failedStatusCode = 500;
    const reqPath = '/auth/local';


    before(async () => {
        actionObj = await sails.helpers.getActionModelByPath(reqPath);
        agent = request.agent(sails.hooks.http.app);
    });

    describe('本地登录Success.', () => {

      it('邮箱登录.', done => {
        agent
          .post(reqPath)
          .send({
            identifier: 'test@seekow.com',
            password: 'test123456'
          })
          .expect(200,done);
      });

      it('用户名登录.', done => {
        request(sails.hooks.http.app)
          .post(reqPath)
          .send({
            identifier: 'test',
            password: 'test123456'
          })
          .expect(200,done);
      });

    });

    describe('本地账号登录Failed.', () => {

      it('邮箱不存在.', done => {
        request(sails.hooks.http.app)
          .post(reqPath)
          .send({
            identifier: 'test2@seekow.com',
            password: 'test123456'
          })
          .expect(failedStatusCode)
          .end((err, res) => {
            if (err) return done(err);
            assert.equal(res.body.message,'账号密码错误.');
            done();
          });
      });

      it('用户名不存在.', done => {
        request(sails.hooks.http.app)
          .post(reqPath)
          .send({
            identifier: 'test278',
            password: 'test123456'
          })
          .expect(failedStatusCode)
          .end((err, res) => {
            if (err) return done(err);
            assert.equal(res.body.message,'账号密码错误.');
            done();
          });
      });

      it('密码错误.', done => {
        request(sails.hooks.http.app)
          .post(reqPath)
          .send({
            identifier: 'test@seekow.com',
            password: 'test12345678'
          })
          .expect(failedStatusCode)
          .end((err, res) => {
            if (err) return done(err);
            assert.equal(res.body.message,'账号密码错误.');
            done();
          });
      });


    });

    after(done => {
        //do something
        agent
          .get('/user/me')
          .expect(200)
          .end((err,res) => {
            if(err) return done(err);
            assert.equal(res.body.user.email,'test@seekow.com');
            done();
          });
    });

});
