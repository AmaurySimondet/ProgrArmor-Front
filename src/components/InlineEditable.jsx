import React, { useState, useEffect } from 'react';

export const InlineEditable = ({ value, onChange, style, autoFocus, placeholder }) => {
    const [text, setText] = useState(value);

    useEffect(() => {
        setText(value); // Update text when the value prop changes
    }, [value]);

    const handleBlur = () => {
        if (onChange) onChange(text);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Check if Enter is pressed without Shift
            e.preventDefault(); // Prevent default action (e.g., new line)
            if (onChange) onChange(text);
        }
    };

    return (
        <textarea
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            autoFocus={autoFocus}
            style={{
                ...style,
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none', // Prevent resizing
                overflow: 'auto', // Allow scroll if needed
                whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
                wordBreak: 'break-word', // Break long words if necessary
            }}
        />
    );
};
