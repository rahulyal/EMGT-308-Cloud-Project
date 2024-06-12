import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';

function Terminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { command: '', output: 'Welcome to the Terminal! Type "help" for available commands.' }
    ]);
    const [result, setResult] = useState('');
    const endOfOutput = useRef(null);

    const handleInput = event => {
        setInput(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        processCommand(input);
    };

    useEffect(() => {
        if (result) {
            setHistory(history => [...history, { command: `$ ${input}`, output: result }]);
            setInput('');
        }
    }, [result]);

    const processCommand = async (command) => {
        const trimmedCommand = command.trim().toLowerCase();
        const commandParts = trimmedCommand.split(' ');
        const action = commandParts[0];  // 'calculate', 'help', or 'clear'

        console.log('Command action:', action);  // Debugging log

        switch (action) {
            case 'help':
                setHistory(history => [...history, { command: `$ ${command}`, output: 'Available commands: help, clear, calculate' }]);
                setInput('');
                break;
            case 'clear':
                setInput('');
                setHistory([]);
                break;
            case 'calculate':
                // Capture everything after 'calculate' keyword as the calculation string
                const calcString = commandParts.slice(1).join(' ');  // Re-join the parts excluding the first keyword
                console.log('Calculation string:', calcString);  // Debugging log

                const response = await fetch('/api/calculatorFunction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ calcString })
                });
                const data = await response.json();
                setResult(data.result || data.error);
                break;
            default:
                setHistory(history => [...history, { command: `$ ${command}`, output: `Command '${command}' not recognized` }]);
                setInput('');
                break;
        }
    };


    useEffect(() => {
        endOfOutput.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, input]);

    return (
        <div className="terminalContainer">
            <table className="terminal">
                <tbody>
                    {history.map((item, index) => (
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
                                    value={input}
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
