import React, { useState, useEffect } from 'react';
import ItemList from '../ItemList/ItemList';
import InputItem from "../InputItem/InputItem";
import Footer from "../Footer/Footer";
import styles from './Todo.module.css';
import Created from "../Created/Created";
import Card from '@material-ui/core/Card';
import { DragDropContext } from "react-beautiful-dnd";

const Todo  = () => {
    const initialState = {
        items:
            JSON.parse(localStorage.getItem('editedList') ||
            '[{"value": "Наведи порядок на своей планете", "isDone": true, "isImportant": true, "id": 1},' +
                '{"value": "Напиши код", "isDone": true, "isImportant": false, "id": 2},' +
                '{"value": "Погладь кота", "isDone": false, "isImportant": false, "id": 3}]'),
        count: JSON.parse(localStorage.getItem('count')) || 3,
        sortTask: 'Все',
    };

    const [items, setTodoItem] = useState(initialState.items);
    const [count, setCount] = useState(initialState.count);
    const [sortTask, setSort] = useState(initialState.sortTask);

    const saveToLocalStorage = (items, count) => {
        let addToLocal = JSON.stringify(items);
        localStorage.setItem("editedList", addToLocal);
        localStorage.setItem("count", JSON.stringify(count));
    };

    useEffect(() => {
        saveToLocalStorage(items, count);
    });

    const onDragEnd = result => {
        const { source, destination } = result;
        if (!destination) return;

        const newTodoItems = [...items];

        const [removed] = newTodoItems.splice(source.index, 1);
        newTodoItems.splice(destination.index, 0, removed);
        setTodoItem([
            ...newTodoItems
        ])
    };

    const onClickDone = id => {
        const newItemList = items.map(item => {
            const newItem = { ...item };

            if (item.id === id) {
                newItem.isDone = !item.isDone;
            }

            return newItem;
        });
        setTodoItem(newItemList);
    };

    const onClickDelete = id => {
        const newItemList = items.filter(item => item.id !== id);
        setTodoItem(newItemList);
    };

    const onClickDeleteDone = () => {
        let isDelete = window.confirm('Удалить выделенное?');

        if (isDelete) {
        const newItemList = items.filter(item => item.isDone === false);
        setTodoItem(newItemList);
    }
    };

    const onMarkImportant = (id) => {
        const newItemList = items.map(item => {
            const newItem = { ...item };

            if (item.id === id) {
                newItem.isImportant = !item.isImportant;
            }

            return newItem;
        });
        setTodoItem(newItemList);
    };

    const onClickCommonInput = () => {
        const newItemList = items.map(item => {
            const newItem = { ...item };

            if (!item.isDone) {
                newItem.isDone = true;
            }

            return newItem;
        });
        setTodoItem(newItemList);
    };

    const onClickAdd = value => {
        const newItems = [
            ...items,
            {
                value,
                isDone: false,
                isImportant: false,
                id: count + 1
            }
        ];
        setTodoItem(newItems);
        setCount ((count) => count + 1);
    };

    const onClickSort = sorting => setSort(sorting);

    let sortingTasks;
    switch (sortTask) {
        case 'Выполнено':
            sortingTasks = items.filter(item => item.isDone);
            break;
        case 'Осталось':
            sortingTasks = items.filter(item => !item.isDone);
            break;
        case 'Всего':
            sortingTasks = items;
            break;
        default :
            sortingTasks = items;
    }

        const allItems = items;
        const completedItems = items.filter(item => item.isDone === true);
        const uncompletedItems = items.filter(item => item.isDone === false);

        return (
            <Card className={styles.wrap}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <h1>Список дел:</h1>
                    <InputItem items={ items } onClickAdd={onClickAdd} />
                    <ItemList items={ items }
                              onClickDone={onClickDone}
                              onMarkImportant={onMarkImportant}
                              onClickDelete={onClickDelete}
                              sort={sortingTasks}
                              sortValue={sortTask}
                    />
                    <Footer count={ uncompletedItems.length }
                            cauntAll={ allItems.length }
                            countDone={ completedItems.length }
                            onClickDeleteDone={onClickDeleteDone}
                            onClickCommonInput={onClickCommonInput}
                            onClickSort={onClickSort}
                            sorting={sortTask}
                    />
                    <Created />
                </DragDropContext>
            </Card>);

};

export default Todo;