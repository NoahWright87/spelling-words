"use client";

import ListBox from '../components/ListBox';
import { useState } from 'react';

interface Item {
    name: string;
}

export default function DevTest() {
    const [items, setItems] = useState<Item[]>([ { name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' } ]);

    const handleAdd = (key: string) => {
        const newItem = { name: key };
        setItems([...items, newItem]);
    };

    const handleRemove = (key: string) => {
        setItems(items.filter(item => item.name !== key));
    };

    const handleSelect = (item: Item) => {
        console.log('Selected item:', item);
    };

    const getKey = (item: Item) => item.name;

    return (
        <div>
            <h1>Development Test Page</h1>
            <p>This is a test page for development purposes.</p>
            <ListBox items={items} onAdd={handleAdd} onRemove={handleRemove} onSelect={handleSelect} getKey={getKey} maxItems={5} />
        </div>
    );
}