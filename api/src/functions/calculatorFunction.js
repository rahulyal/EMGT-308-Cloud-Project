const { app } = require('@azure/functions');

app.http('calculatorFunction', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        let calcString;
        try {
            const body = await request.json();
            calcString = body.calcString;
        } catch (error) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Invalid request body' })
            };
        }

        if (!calcString) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'calcString is required' })
            };
        }

        try {
            const result = Calculator(calcString);
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result })
            };
        } catch (error) {
            context.log('Calculation error:', error);
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error processing calculation' })
            };
        }
    }
});


// Ensure Calculator function is defined or imported
function Calculator(calcString) {
    class Token {
        constructor(val, type) {
            this.val = val;
            this.type = type;
            this.left = null;
            this.right = null;
        }
    }

    const isOperator = (val) => ['+', '-', '*', '/'].includes(val);

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
    };

    const Splicer = (Tokens, operators) => {
        for (let i = 0; i < Tokens.length; i++) {
          if (Tokens[i].val === operators[0] || Tokens[i].val === operators[1]) {
            Tokens[i].left = Tokens[i - 1]
            Tokens[i].right = Tokens[i + 1]
            Tokens.splice(i - 1, 1)
            Tokens.splice(i, 1)
            i -= 1
          }
        }
      }

    const Treeify = (Tokens) => {
        const operators = [['*', '/'], ['+', '-']];
        operators.forEach(op => Splicer(Tokens, op));
    };

    const compute = (token) => {
        if (token.type === 'number') {
            return Number(token.val);
        }
        const left = compute(token.left);
        const right = compute(token.right);
        switch (token.val) {
            case '*': return left * right;
            case '/': return left / right;
            case '+': return left + right;
            case '-': return left - right;
        }
    };

    const Tokens = Tokenizer(calcString);
    Treeify(Tokens);
    return compute(Tokens[0]);
}
