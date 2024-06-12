import React, { useReducer, useRef, useEffect } from 'react';
import './Terminal.css';

const initialState = {
    input: '',
    history: [{ command: '', output: 'Welcome to the Terminal! Type "help" for available commands.' }],
    result: ''
};

function reducer(state, action) {
    switch (action.type) {
        case 'setInput':
            return { ...state, input: action.payload };
        case 'addHistory':
            return { ...state, history: [...state.history, action.payload] };
        case 'clearHistory':
            return { ...state, history: [] };
        case 'setResult':
            return { ...state, result: action.payload };
        default:
            throw new Error('Unhandled action type');
    }
}

function Terminal() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const endOfOutput = useRef(null);

    useEffect(() => {
        if (state.result) {
            dispatch({ type: 'addHistory', payload: { command: `$ ${state.input}`, output: state.result } });
            dispatch({ type: 'setInput', payload: '' });
        }
    }, [state.result]);

    useEffect(() => {
        endOfOutput.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.history]);

    const handleInput = event => {
        dispatch({ type: 'setInput', payload: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedCommand = state.input.trim().toLowerCase();
        const commandParts = trimmedCommand.split(' ');
        const action = commandParts[0];

        switch (action) {
            case 'help':
                dispatch({ type: 'addHistory', payload: { command: `$ ${state.input}`, output: 'Available commands: help, clear, calculate' } });
                dispatch({ type: 'setInput', payload: '' });
                break;
            case 'clear':
                dispatch({ type: 'clearHistory' });
                dispatch({ type: 'setInput', payload: '' });
                break;
            case 'calculate':
                const calcString = commandParts.slice(1).join(' ');
                const response = await fetch('/api/calculatorFunction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ calcString })
                });
                const data = await response.json();
                dispatch({ type: 'setResult', payload: data.result || data.error });
                break;
            default:
                dispatch({ type: 'addHistory', payload: { command: `$ ${state.input}`, output: `Command '${state.input}' not recognized` } });
                dispatch({ type: 'setInput', payload: '' });
                break;
        }
    };

    return (
        <div className="terminalContainer">
            <table className="terminal">
                <tbody>
                    {state.history.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr><td>{item.command}</td></tr>
                            <tr ref={endOfOutput}><td>{item.output}</td></tr>
                        </React.Fragment>
                    ))}
                    <tr>
                        <td>
                            <form onSubmit={handleSubmit}>
                                <span>$ </span>
                                <input
                                    type="text"
                                    value={state.input}
                                    onChange={handleInput}
                                    autoFocus
                                />
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Terminal;
