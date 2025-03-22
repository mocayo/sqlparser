/**
 * lexer
 */

class Lexer {
  /**
   * 预处理
   * @param  {string} q 原始sql语句
   * @return {string} 预处理后的sql
   */
  pre(q) {
    // 处理换行'\n'
    let s = q.replace(/\n/g, ' ');
    // 处理注释块'/**/'
    s = s.replace('/^(\/\*[^]*?(?:\*\/|$))/g', ' ');
    // 处理嵌套'(',')'
    s = s.replace(/\(/g, ' ( ');
    s = s.replace(/\)/g, ' ) ');
    // 处理字段之间的','
    s = s.replace(/,/g, ' , ');
    // 处理结束符号';'
    if (!s.match(/ *; *$/)) throw "no end symbol ;";
    if (s.match(/;/g).length > 1) {
      throw "illegal char ';' at col " + q.indexOf(';');
    } else {
      s = s.replace(';', ' ;');
    }
    // 处理条件语句 '=', '<', '>', '<>'
    s = s.replace(/=/g, ' = ');
    s = s.replace(/</g, ' < ');
    s = s.replace(/>/g, ' > ');
    s = s.replace(/<\ *>/g, ' <> ');
    // 处理多余空格' +'
    s = s.replace(/ +/g, ' ');
    return s;
  }

  /**
   * 分词
   * @param  {string} q 原始sql语句
   * @return {Array}  词组
   */
  split(q) {
    return q.split(' ');
  }

  lex(q) {
    return this.split(this.pre(q)).map(x => x.toLowerCase());
  }

}

module.exports = Lexer;
