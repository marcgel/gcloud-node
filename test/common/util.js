/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global describe, it */

'use strict';

var assert = require('assert');
var util = require('../../lib/common/util.js');

describe('extend', function() {
  it ('should return null for null input', function() {
    var copy = util.extend(null, {});
    assert.strictEqual(copy, null);
  });

  it('should return a new Date for Date input', function() {
    var now = new Date();
    var copy = util.extend(now, {});
    assert.notStrictEqual(copy, now);
    assert.strictEqual(copy.toString(), now.toString());
  });
});

describe('arrayize', function() {
  it('should arrayize if the input is not an array', function(done) {
    var o = util.arrayize('text');
    assert.deepEqual(o, ['text']);
    done();
  });
});

describe('handleResp', function() {
  it('should handle errors', function(done) {
    var defaultErr = new Error('new error');
    util.handleResp(defaultErr, null, null, function(err) {
      assert.equal(err, defaultErr);
      done();
    });
  });

  it('should handle body errors', function(done) {
    var apiErr = {
      errors: [{ foo: 'bar' }],
      code:  400,
      message: 'an error occurred'
    };
    util.handleResp(null, {}, { error: apiErr }, function(err) {
      assert.deepEqual(err.errors, apiErr.errors);
      assert.strictEqual(err.code, apiErr.code);
      assert.deepEqual(err.message, apiErr.message);
      done();
    });
  });

  it('should try to parse JSON if body is string', function(done) {
    var body = '{ "foo": "bar" }';
    util.handleResp(null, {}, body, function(err, body) {
      assert.strictEqual(body.foo, 'bar');
      done();
    });
  });

  it('should return error code if there are not other errors', function(done) {
    util.handleResp(null, { statusCode: 400 }, null, function(err) {
      assert.strictEqual(err.message, 'error during request, statusCode: 400');
      done();
    });
  });
});
