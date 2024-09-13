import React, { useState, useEffect } from 'react';

export const InlineEditable = ({ value, onChange, style, autoFocus }) => {
    const [text, setText] = useState(value);

    useEffect(() => {
        setText(value); // Update text when the value prop changes
    }, [value]);

    const handleBlur = () => {
        if (onChange) onChange(text);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (onChange) onChange(text);
        }
    };

    return (
        <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            // make the input dont look like an input
            autoFocus={autoFocus}
            style={{ ...style, width: '100%', border: 'none', borderBottom: "none", outline: "none" }}
        />
    );
};