/**
 * sql 信息
 */
class Ans {
  set(k, v) {
    this[k] = v;
  }
  get(k) {
    return this[k];
  }
}

/**
 * parser
 */
class Parser {

  /**
   * select 语句
   * @param  {Array} words 词组
   * @return {Map} sql信息
   */
  select(words) {
    while(words.shift() != 'select') {};
    let ans = new Ans();
    ans.set('statement', 'select');
    let fields = [];
    let from_flag = false;
    for (let word of words) {
      if ('from' === word) {
        from_flag = true;
        break;
      }
      else if (',' === word) continue;
      else {
        fields.push(word);
      }
    }
    if (!from_flag) throw "no from clause!";
    if (fields.length == 0) throw "no fields selected!";
    let cols = [];
    let alias = [];
    for (let field of fields) {
      if (field.match(/\w+\.\w+/)) {
        alias.push(field.split('\.')[0]);
      }
      // 检查field格式
      if (field.match(/\w+\.$/) || field.match(/$\.\w+/) || '.' === field) {
        throw `field error, shouldn't be '${words[i]}'`;
      }
      cols.push(field);
    }
    ans.set('colsinfo', cols);
    if (alias.length > 0) ans.set('alias', alias);
    return this.from(words, ans);
  }

  /**
   * from 语句
   * @param  {Array} words 词组
   * @param  {Ans} ans   已解析的信息
   * @return {Ans}       sql信息
   */
  from(words, ans) {
    while (words.shift() != 'from') {};
    let tables = [];
    let alias_table_map = new Ans();
    let br = 0;
    let where_flag = false;
    let order_flag = false;
    for (let i = 0; i < words.length; i++) {
      if ('order' == words[i]) {
        order_flag = true;
        break;
      }
      if ('where' == words[i]) {
        where_flag = true;
        break;
      }
      if (";" === words[i]) break;
      if (br == 0) {
        tables.push(words[i]);
        br = 1;
      } else if (br == 1) {
        alias_table_map.set(words[i], words[i - 1]);
        br = 0;
      } else {}
      if (',' === words[i]) br = 0;
    }
    ans.set('tablesinfo', tables);
    ans.set('alias_table_map', alias_table_map);
    // console.log(alias_table_map);
    if (where_flag) {
      return this.where(words, ans);
    } else if (order_flag) {
      return this.order_by(words, ans);
    } else return ans;
  }

  /**
   * where 语句
   * @param  {Array} words 词组
   * @param  {Ans} ans   已解析的信息
   * @return {Ans}       sql信息
   */
  where(words, ans) {
    while (words.shift() != 'where') {};
    let conditions = [];
    let br = 0;
    let c = new Ans();
    let order_flag = false;
    let alias = [];
    if (ans.get('alias_table_map')) {
      for (let v of Object.keys(ans.get('alias_table_map'))) {
        alias.push(v);
      }
    }
    for (let i = 0; i < words.length; i++) {
      if ('order' == words[i]) {
        order_flag = true;
        break;
      }
      if (br == 0) {
        // 检查别名
        if (words[i].match(/\w+\.\w+/)) {
          let _alia = words[i].split('.')[0];
          if (!alias.includes(_alia))
            throw `alia ${_alia} undefined!`;
        }
        // 检查left格式
        if (words[i].match(/\w+\.$/) || words[i].match(/$\.\w+/) || '.' === words[i]) {
          throw `the left of condition error, shouldn't be "${words[i]}"`;
        }
        c.set('left', words[i]);
        br = 1;
      } else if (br == 1) {
        // 处理not
        if ('not' === words[i]) {
          c.set('op', words[i]);
        } else {
          if (c.get('op')) {
            c.set('op', c.get('op') + ' ' + words[i]);
          } else {
            c.set('op', words[i]);
          }
          br = 2;
        }
      } else if (br == 2) {
        // 检查子查询
        if ('(' === words[i]) {
          let j = i;
          // 匹配')'
          while (j < words.length && words[j] != ')') j++;
          if (')' === words[j]) {
            if (i + 1 == j) {
              throw `empty sub query from ${i} to ${j}`;
            }
            let subwords = words.slice(i + 1, j);
            subwords.push(';');
            // console.log('*********************');
            let subans = this.parse(subwords);
            // console.log(subans);
            c.set('right', subans);
            // console.log('*********************');
            i = j;
            if (words[i] == ')') i++;
          } else {
            throw `'(' without ')' matched`;
          }
        } else {
          c.set('right', words[i]);
        }
        conditions.push(c);
        c = new Ans();
        br = 0;
      } else {}
      if ('and' === words[i]) br = 0;
    }
    ans.set('conditions', conditions);
    if (order_flag) return order_by(words, ans);
    else return ans;
  }

  /**
   * order by 语句
   * @param  {Array} words 词组
   * @param  {Ans} ans   已解析的信息
   * @return {Ans}       sql信息
   */
  order_by(words, ans) {
    return ans;
  }

  /**
   * 语法分析
   * @param  {Array} words 词组
   * @return {Ans}       sql信息
   */
  parse(words) {
    switch(words[0]) {
      case 'select':
        return this.select(words);
      default:
        throw "only support select now!";
    }
  }

}

module.exports = Parser;
