import React, { useState } from 'react';

interface ListBoxProps<T> {
    items: T[];
    onAdd: (key: string) => void;
    onRemove: (key: string) => void;
    onSelect: (item: T) => void;
    getKey: (item: T) => string;
    maxItems: number;
}

const ListBox = <T,>({ items, onAdd, onRemove, onSelect, getKey, maxItems }: ListBoxProps<T>) => {
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const handleRemove = () => {
        if (selectedKey !== null) {
            const confirmRemove = window.confirm(`Are you sure you want to remove ${selectedKey}?`);
            if (confirmRemove) {
                onRemove(selectedKey);
                setSelectedKey(null);
            }
        }
    };

    const handleSelect = (key: string, item: T) => {
        if (selectedKey === key) {
            setSelectedKey(null);
        } else {
            setSelectedKey(key);
            onSelect(item);
        }
    };

    const handleAdd = () => {
        const key = window.prompt('Enter the name of the new item:', 'New item');
        if (key) {
            onAdd(key);
        }
    };

    return (
        <div className="listbox">
            <ul style={{ maxHeight: `${maxItems * 2.5}em`, overflowY: 'auto', height: `${maxItems * 2.5}em` }}>
                {items.map((item) => {
                    const key = getKey(item);
                    return (
                        <li key={key} onClick={() => handleSelect(key, item)} className={selectedKey === key ? 'selected' : ''}>{key}</li>
                    );
                })}
            </ul>
            <div className="buttons">
                <button className="button" onClick={handleAdd}>Add</button>
                <button className="button" onClick={handleRemove} disabled={selectedKey === null}>Remove</button>
            </div>
        </div>
    );
};

export default ListBox;
