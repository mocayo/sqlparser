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
    return this.split(this.pre(q));
  }

}

module.exports = Lexer;
