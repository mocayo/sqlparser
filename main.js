/**
 * index
 * 入口
 */

let Lexer = require('./lexer');
let Parser = require('./parser');

// queries
let query1 = `SELECT id, name, dept, score
FROM Student;`;
let query2 = `SELECT *
FROM Student s
WHERE s.score > 90 AND dept = '计算机';`;
let query3 = `SELECT *
FROM Student
WHERE dept IN
 (SELECT dept
    FROM Student
    WHERE name='张三');`;
let query4 = `SELECT *
FROM Student s
WHERE s. > 90;`;

let lexer = new Lexer();
let parser = new Parser();

function ast(q) {
  let words = lexer.lex(q);
  let ans;
  try {
    console.log(q);
    console.log(parser.parse(words));
    console.log('----------')
  } catch (e) {
    console.log(e);
  }

}

ast(query1);
ast(query2);
