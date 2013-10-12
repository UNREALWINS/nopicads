var fs = require('fs');

var chai = require('chai');
var expect = chai.expect;
var connect = require('connect');
var Browser = require('chimera').Chimera;

var _ = require('../src/util/core.js');
var npa = require('../src/util/dom.js');

_.info = _.nop;
_.warn = _.nop;


var defaultConfig = {
  version: 1,
  redirect_image: true,
  align_image: true,
};

function wrap (browser, config) {
  config = config || {};
  _.C(defaultConfig).each(function (v, k) {
    if (!config.hasOwnProperty(k)) {
      config[k] = v;
    }
  });

  var tmp = npa({
    _: _,
    window: browser.window,
    unsafeWindow: browser.window,
    GM: {
      getValue: function (key, default_) {
        if (config.hasOwnProperty(key)) {
          return config[key];
        }
        return default_;
      },
      setValue: function (key, value) {
        config[key] = value;
      },
      registerMenuCommand: _.nop,
    },
  });
  tmp._main(true);

  return tmp;
}

function prepare () {
  function nop () {
  }
  window._ = _;
  window.unsafeWindow = window;
  window.GM_setValue = nop;
  window.GM_getValue = nop;
  window.GM_registerMenuCommand = nop;
  window.GM_xmlhttpRequest = nop;
  window.GM_getResourceText = nop;
  window.GM_getResourceURL = nop;
  window.GM_addStyle = nop;
}

function prepare2 () {
  window.$ = $;
}

var SERVER_PORT = 1234;
var SERVER_HREF = _.T('http://localhost:{0}')(SERVER_PORT);
var SERVER_PAGE_1 = SERVER_HREF + '/one.html';
var SERVER_PAGE_2 = SERVER_HREF + '/two.html';


describe('dom', function () {
  'use strict';

  var browser;

  before(function (done) {
    this.server = connect().use(connect.static('./tests')).listen(SERVER_PORT, done);
    browser = new Browser({
      libraryCode: fs.readFileSync('./src/util/core.js') + '(' + prepare + ')();' + fs.readFileSync('./src/util/dom.js') + '(' + prepare2 + ')();',
    });
  });

  after(function () {
    this.server.close();
  });

  afterEach(function () {
    browser.close();
  });


  describe('$', function () {

    it('should find right element', function (done) {
      browser.perform({
        url: SERVER_PAGE_1,
        run: function (callback) {
          var d = null;
          try {
            d = $('#div_1');
          } catch (e) {
            callback(e);
            return;
          }
          var s = null;
          try {
            s = $('.label', d);
          } catch (e) {
            callback(e);
            return;
          }
        },
        callback: function (e, a) {
          a.should.equals('function');
          done(e);
        },
      });
      // browser.visit(SERVER_PAGE_1).then(function () {
      //   var $ = wrap(browser);

      //   var d = $('#div_1');
      //   expect(d).to.be.exist;

      //   var s = $('.label', d);
      //   expect(s).to.be.exist;
      //   s.textContent.should.equal('text 2');

      //   done();
      // }).done(null, function (error) {
      //   done(error);
      // });
    });

    // it('shoud throw exception if not found', function (done) {
    //   browser.visit(SERVER_PAGE_1).then(function () {
    //     var $ = wrap(browser);

    //     (function () {
    //       $('does_not_exist');
    //     }).should.throw(_.NoPicAdsError);

    //     done();
    //   }).done(null, function (error) {
    //     done(error);
    //   });
    // });

  });


  // describe('$.$', function () {

  //   it('should find right element', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser);

  //       var d = $.$('#div_1');
  //       expect(d).to.be.exist;

  //       var s = $.$('.label', d);
  //       expect(s).to.be.exist;
  //       s.textContent.should.equal('text 2');

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  //   it('shoud return null if not found', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser);

  //       var d = $.$('does_not_exist');
  //       expect(d).to.be.null;

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  // });


  // describe('$.$$', function () {

  //   it('should return collection', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser);

  //       $.$$('.label').each(function (v) {
  //         // jsdom does not support classList yet
  //         v.getAttribute('class').should.equal('label');
  //       });

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  // });


  // describe('$.removeNodes', function () {

  //   it('should return collection', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser);

  //       $.removeNodes('.label');
  //       expect($.$('.label')).to.be.not.found;

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  // });


  // describe('$.openLink', function () {

  //   it('should not accept invalid URL', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser);

  //       $.openLink(null);
  //       browser.window.location.toString().should.equals(SERVER_PAGE_1);

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  //   it('should redirect to a valid URL', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser);

  //       $.openLink(SERVER_PAGE_2);
  //       browser.window.location.toString().should.equals(SERVER_PAGE_2);

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  // });


  // describe('$.openImage', function () {

  //   it('should not accept invalid URL', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser);

  //       $.openImage(null);
  //       browser.window.location.toString().should.equals(SERVER_PAGE_1);

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  //   it('should not open image if redirect_image is disabled', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser, {
  //         redirect_image: false,
  //       });

  //       $.openImage('does_not_exist');
  //       browser.window.location.toString().should.equals(SERVER_PAGE_1);

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  //   it('should open image by default', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser);

  //       var path = '/does_not_exist';
  //       $.openImage(path);
  //       browser.window.location.pathname.should.equals(path);

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  // });


  // describe('$.replace', function () {

  //   it('should not accept invalid URL', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser);

  //       var b = browser.window.document.body;
  //       $.replace(null);
  //       browser.window.document.body.should.be.equals(b);

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  //   it('should not replace body if redirect_image is disabled', function (done) {
  //     browser.visit(SERVER_PAGE_1).then(function () {
  //       var $ = wrap(browser, {
  //         redirect_image: false,
  //       });

  //       var b = browser.window.document.body;
  //       $.replace('does_not_exist');
  //       browser.window.document.body.should.be.equals(b);

  //       done();
  //     }).done(null, function (error) {
  //       done(error);
  //     });
  //   });

  //   it('should replace document.body');

  // });

});


// ex: ts=2 sts=2 sw=2 et
// sublime: tab_size 2; translate_tabs_to_spaces true; detect_indentation false; use_tab_stops true;
// kate: space-indent on; indent-width 2;
