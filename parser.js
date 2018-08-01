/**
 * parser
 */

class Statement {

}

class Parser {

  /**
   * select 语句
   * @param  {Array} words 词组
   * @return {Map} sql信息
   */
  select(words) {
    while(words.shift() != 'select') {};
    let ans = new Map();
    ans.set('statement', 'select');
    let fields = [];
    for (let word of words) {
      if ('from' === word) break;
      else if (',' === word) continue;
      else {
        fields.push(word);
      }
    }
    if (fields.length == 0) throw "no fields selected!";
    let cols = [];
    let alias_map = new Map();
    let alias = [];
    for (let field of fields) {
      if (field.match(/\w+\.\w+/)) {
        alias_map.set(field.split('\.')[0], field.split('\.')[1]);
        alias.push(field.split('\.')[0]);
      }
      cols.push(field);
    }
    ans.set('colsinfo', cols);
    ans.set('alias', alias);
    ans.set('alias_map', alias_map);
    return this.from(words, ans);
  }

  where(words, ans) {
    while (words.shift() != 'where') {};
    console.log(ans);
    return ans;
  }

  from(words, ans) {
    while (words.shift() != 'from') {};
    let tables = [];
    let alias_table_map = new Map();
    for (let i = 0; i < words.length; i++) {
      if ('order' == words[i]) {
        ans.set('tables', tables);
        return this.order_by(words, ans);
      }
      if ('where' == words[i]) {
        ans.set('tables', tables);
        return this.where(words, ans);
      }
      if (words[i].includes(';')) {
        tables.push(words[i].slice(0, -1));
        break;
      }
      if (ans.alias && ans.alias.includes(words[i])) {
        alias_table_map.set(words[i], words[i - 1]);
      }
      tables.push(words[i]);
    }
    ans.set('tables', tables);
    return ans;
  }

  order_by(words) {

  }

  parse(words) {
    console.log(words);
    switch(words[0]) {
      case 'select':
        return this.select(words);
      default:
        throw "only support select now!";
    }
  }

  filter(m) {
    let ks = ['statement', 'colsinfo', 'tablesinfo', 'conditions', 'orderinfo', 'groupinfo'];
  }

}

module.exports = Parser;
