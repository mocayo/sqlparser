/**
 * index
 * 入口
 */

let Pre = require('./pre.js');
let Tokenizer = require("./tokenizer");
let Lexer = require('./lexer');

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

let p = new Pre();
let t = new Tokenizer();
let lexer = new Lexer();

function ast(q) {
  let s = lexer.lex(q);
  console.log(lexer.pre(q));
  console.log(s);
}

ast(query1);
