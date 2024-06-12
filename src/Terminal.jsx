import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css'; // Ensure your styles are imported

function Terminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { command: '', output: 'Welcome to the Terminal! Type "help" for available commands.' } // Initial welcome message
    ]);
    const endOfOutput = useRef(null);

    const handleInput = event => {
        setInput(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        const output = processCommand(input);
        setHistory(history => [...history, { command: `$ ${input}`, output }]);
        setInput('');
    };

    const processCommand = (command) => {
        // Dummy function to simulate command processing
        switch (command.toLowerCase()) {
            case 'help':
                return 'Available commands: help, clear, ...';
            case 'clear':
                setHistory([]);
                return null;
            default:
                return `Command '${command}' not recognized`;
        }
    };

    useEffect(() => {
        endOfOutput.current?.scrollIntoView({ behavior: 'instant' });
    }, [history]);

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
