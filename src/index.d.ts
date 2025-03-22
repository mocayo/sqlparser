// Token 相关类型定义
export interface Token {
    type: string;
    value: string;
}

// Lexer 类定义
export declare class Lexer {
    private input: string;
    private position: number;
    private currentChar: string | null;

    constructor();
    
    initialize(input: string): void;
    advance(): void;
    skipWhitespace(): void;
    peek(): string | null;
    getNumber(): string;
    getIdentifier(): string;
    getNextToken(): Token | null;
}

// AST 节点相关接口定义
export interface ASTNode {
    type: string;
    [key: string]: any;
}

export interface SelectNode extends ASTNode {
    type: 'SELECT';
    columns: ColumnNode[];
    from?: FromNode;
    where?: WhereNode;
}

export interface ColumnNode extends ASTNode {
    type: 'COLUMN';
    name: string;
}

export interface FromNode extends ASTNode {
    type: 'FROM';
    table: string;
}

export interface WhereNode extends ASTNode {
    type: 'WHERE';
    left: ASTNode;
    operator: string;
    right: ASTNode;
}

// Parser 类定义
export declare class Parser {
    private tokens: Token[];
    private currentToken: Token | null;
    private pos: number;

    constructor(tokens: Token[]);
    
    eat(tokenType: string): Token;
    parseSelect(): SelectNode;
    parseColumnList(): ColumnNode[];
    parseColumn(): ColumnNode;
    parseFrom(): FromNode;
    parseWhere(): WhereNode;
    parse(): ASTNode;
}
