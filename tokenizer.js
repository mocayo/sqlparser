/**
 * tokenizer
 * 分词
 */

class Tokenizer {
  test() {
    console.log('test');
  }

  getTokenWhitespace(restStr) {
    const matches = restStr.match(/^(\s+)/);
    if (matches) {
      return { type, value: matches[1] };
    }
  }
}

module.exports = Tokenizer;
