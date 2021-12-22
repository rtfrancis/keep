import React, { useState } from 'react';
import { Input, VStack, HStack, FormLabel, Button, IconButton, Checkbox, Text, Heading, Divider } from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon, CheckIcon } from "@chakra-ui/icons"


const List = () => {
    const [ listTitle, setListTitle ] = useState("");
    const [ toDoItems, setToDoItems ] = useState<string[]>([]);
    const [ completedItems, setCompletedItems ] = useState<string[]>([]);
    const [ newToDo, setNewToDo ] = useState("");
    const [ errorText, setErrorText ] = useState("")
    const [ tempTitle, setTempTitle ] = useState("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewToDo(event.target.value)
    }

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempTitle(event.target.value)
    }

    const addItemToList = (item?: string) => {
        if(item){
            setErrorText("")
            setToDoItems([...toDoItems, item])
            setNewToDo("");
        }
        else if(newToDo.length){
            setErrorText("")
            setToDoItems([...toDoItems, newToDo])
            setNewToDo("");
        } else {
            setErrorText("Please fill in field.")
        }
    }

    const editListItem = (item: string) => {
        setNewToDo(item);
        removeItemFromList(item, "to-do");
    }

    const toggleItemAsComplete = (item: string) => {
        if(toDoItems.indexOf(item) > -1){
            removeItemFromList(item, "to-do");
            setCompletedItems([...completedItems, item])
        } 
        if(completedItems.indexOf(item) > -1){
            removeItemFromList(item, "completed")
            setToDoItems([...toDoItems, item])
        }
    }

    const removeItemFromList = (item: string, list: string) => {
        let index: number;
        let updatedArray: string[];
        if(list === "completed"){
            index = completedItems.indexOf(item)
            updatedArray = completedItems;
            updatedArray.splice(index, 1);
            setCompletedItems(updatedArray)
        }
        if(list === "to-do"){
            index = toDoItems.indexOf(item)
            updatedArray = toDoItems;
            updatedArray.splice(index, 1);
            setToDoItems(updatedArray)
        }
        console.log("list items", toDoItems)
        console.log("completed items", completedItems)
    }

    const saveList = () => {
        const listObject = {
            title: listTitle,
            toDo: toDoItems,
            completed: completedItems
        }
        const attemptString = JSON.stringify(listObject)
        console.log(attemptString)
        localStorage.setItem(`List: ${listObject.title}`, attemptString)
        
    }

    const deleteList = () => {
        localStorage.removeItem(listTitle);
    }

    return (
        <div>
            <VStack w={400} mt={20}>
                {listTitle && listTitle.length > 1 ? 
                    <HStack w="full" justifyContent="space-between" mb={7}>
                        <Heading>{listTitle}:</Heading> 
                        <IconButton aria-label="Edit Title" icon={<EditIcon />} onClick={() => setListTitle("")}/>
                    </HStack>
                    : 
                    <HStack w="full">
                        <Input placeholder='Give this list a title' onChange={handleTitleChange} value={tempTitle}/>
                        <IconButton aria-label="Name List" icon={<CheckIcon />} onClick={() => setListTitle(tempTitle)}/>
                    </HStack>
                }   
                <Text>{errorText}</Text>
                <HStack w="full">
                    <Input placeholder='Add item' onChange={handleChange} value={newToDo}/>
                    <IconButton aria-label="Add To-Do item" icon={<AddIcon />} onClick={() => addItemToList()}/>
                </HStack>
                {toDoItems && toDoItems.length > 0 ?<Text w="full">To Do:</Text> : null}
                
                {toDoItems && toDoItems ? toDoItems.map(item => (
                        <HStack key={item} alignItems="center" justifyContent="space-between" w="full">
                                <Checkbox ml={2} onChange={e => toggleItemAsComplete(item)}><Text fontSize={20}>{item}</Text></Checkbox>
                                <span>
                                    <IconButton aria-label="Edit Item" icon={<EditIcon />} mr={2} onClick={() => editListItem(item)}/>
                                    <IconButton aria-label="Remove Item" icon={<DeleteIcon />} onClick={() => removeItemFromList(item, "to-do")}/>
                                </span>
                        </HStack>
                )) : null }
                
                {completedItems && completedItems.length > 0 ?<Text w="full" >Completed:</Text> : null}
                {completedItems && completedItems.length ? completedItems.map(item => (
                    <HStack key={item} alignItems="center" justifyContent="space-between" w="full">
                            <Checkbox ml={2} onChange={e => toggleItemAsComplete(item)} defaultChecked><Text fontSize={20}>{item}</Text></Checkbox>
                            <IconButton aria-label="Remove Item" icon={<DeleteIcon />} onClick={e => removeItemFromList(item, "completed")}/>
                    </HStack>
                )) : null }
                <Divider/>
                <HStack w="full">
                    <Button w="full" onClick={saveList}>Save List</Button>
                    <Button w="full" onClick={deleteList}>Delete List</Button>
                </HStack>
                <Button w="full">Back to Dashboard</Button>
            </VStack>

        </div>
    )
}

export default List;