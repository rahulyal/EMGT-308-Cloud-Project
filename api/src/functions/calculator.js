class Token {
    constructor(val, type) {
      this.val = val;
      this.type = type;
      this.left = null;
      this.right = null;
    }
  }
  
  const isOperator = (val) => {
    return ['+', '-', '*', '/'].includes(val);
  }
  
  const Tokenizer = (calcString) => {
    let Tokens = [];
    let prev = '';
  
    for (let i = 0; i < calcString.length; i++) {
      if (isOperator(calcString[i])) {
        Tokens.push(new Token(prev, 'number'));
        Tokens.push(new Token(calcString[i], 'operator'));
        prev = '';
      } else {
        prev += calcString[i];
      }
    }
  
    if (prev) {
      Tokens.push(new Token(prev, 'number'));
    }
  
    return Tokens;
  }
  
  const Splicer = (Tokens, operators) => {
    for (let i = 0; i < Tokens.length; i++) {
      if (operators.includes(Tokens[i].val)) {
        Tokens[i].left = Tokens[i - 1];
        Tokens[i].right = Tokens[i + 1];
        Tokens.splice(i - 1, 1);
        Tokens.splice(i, 1);
        i -= 1;
      }
    }
  }
  
  const Treeify = (Tokens) => {
    const operatorPrecedence = [['*', '/'], ['+', '-']];
    for (let ops of operatorPrecedence) {
      Splicer(Tokens, ops);
    }
  }
  
  const compute = (token) => {
    if (token.type === 'number') {
      return Number(token.val);
    }
    let left = compute(token.left);
    let right = compute(token.right);
    
    switch (token.val) {
      case '*': return left * right;
      case '/': return left / right;
      case '+': return left + right;
      case '-': return left - right;
      default: return 0;
    }
  }
  
  module.exports = { Tokenizer, Treeify, compute };
  