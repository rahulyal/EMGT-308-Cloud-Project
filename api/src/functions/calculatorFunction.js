const { app } = require('@azure/functions');
const { Tokenizer, Treeify, compute } = require('./calculator');

app.http('calculatorFunction', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const body = await request.json();
            const calcString = body.calcString;

            if (calcString) {
                let Tokens = Tokenizer(calcString);
                Treeify(Tokens);
                const result = compute(Tokens[0]);
                return { body: { result } };
            } else {
                return { status: 400, body: { error: 'Please provide a calculation string' } };
            }
        } catch (error) {
            context.log.error('Error processing request:', error);
            return { status: 500, body: { error: 'An error occurred processing the request' } };
        }
    }
});
