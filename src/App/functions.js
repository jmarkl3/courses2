// #region conversion functions
// The conversion functions convert one data type to another
export function objectToArray(obj) {
    if(!obj) return []
    // Turn an object into an array of objects
    var tempArray = Object.entries(obj).map( item => {
        var returnObject = {...item[1]}
        returnObject.id = item[0]
        return returnObject
    });

    // sort the array by index
    tempArray.sort((a, b) => (a?.index > b?.index) ? 1 : -1)

    // return the array
    return tempArray
}
export function arrayToObject(array){
    var tempObject = {}
    array.forEach(item => {
        tempObject[item.id] = item
    })
    return tempObject
}

// #endregion conversion functions

// #region getter functions
// The getter functions get things from input data

export function getItem(courseData, chapterID, sectionID, elementID){
    // If there is no chapterID, return the courseData
    if(!chapterID) return {...courseData}

    // Get the chapter
    var chapter = courseData?.items[chapterID]
    // If there is no sectionID, return the chapter
    if(!sectionID) return {...chapter}

    // Get the section 
    var section = chapter?.items[sectionID]
    // If there is no elementID, return the section
    if(!elementID) return {...section}

    // Get the element
    var element = section?.items[elementID]    
    // Return the element
    return {...element}
}

export function getFirstItem(object){
    var tempArray = objectToArray(object)
    if(!tempArray || !tempArray.length) return null
    return tempArray[0]
}

export function getChapter(courseData, chapterID){
    var chapter = courseData?.items[chapterID]    
    return  {...chapter}
}
export function getLastItemID(object){
    var tempArray = objectToArray(object)
    if(!tempArray || !tempArray.length) return null
    return tempArray[tempArray.length - 1].id
}

export function nItemsInObject(object){
    if(!object) return 0
    var tempObject = {...object}
    var tempArray = objectToArray(tempObject)
    if(!tempArray || !tempArray.length) return 0
    return tempArray?.length
}

// #endregion getter functions

// #region modifier functions
// The modifier functions modify and return data 

export function removeItem(object, itemToRemoveID){
    var tempObject = {...object}
    delete tempObject[itemToRemoveID]
    return tempObject
}
export function insertItem(object, itemToInsert, itemToInsertAfterID){

    // Create an array from the object (will be sorted by current index)
    var itemArray = objectToArray(object)
    console.log("itemArray", itemArray)
    
    var tempArray = []
    // Flag variable to determine index offset
    var indexOffset = 0
    var insertedItem = false
    var indexCounter = 0
    // Put each item in the array with an updated index
    itemArray.forEach((item, index) => {        
        console.log("item", item.name, index)
        // If this is not the item to insert
        if(item.id !== itemToInsert.id){
            console.log("adding it ", itemToInsert.id," !== " ,item.id)
            // Set the index based on array index plus the index offset
            item.index = indexCounter
            // Increment the index counter
            indexCounter++
            
            // Push the item to the temp array
            tempArray.push(item)

        }else{
            console.log("not adding it")
        }

        // If the id of the current item is the id of the item to insert after, insert the new item
        if(item.id === itemToInsertAfterID){  
            console.log("adding it after found item")          
            // The id will be the id of the item to insert after plus one
            itemToInsert.index = indexCounter 
            // Incremet the index counter
            indexCounter++

            // Push the itemToInsert to the temp array
            tempArray.push(itemToInsert)

            // Set this flag so we know the item has been inserted
            insertedItem = true
        }

    })    

    // If the item was not inserted (itemToInsertAfterID was not found), push it to the end of the array
    if(!insertedItem)
        tempArray.push(itemToInsert)

    return arrayToObject(tempArray)     
    
}

export function newIDsObject(object){
    // Put a new ID in the temp object
    var tempObject = {...object}
    tempObject.id = newID()

    // Create an array from the objects items
    var tempArray = objectToArray(tempObject.items)
    // Create a new array to hold the new items with updated IDs    
    var tempArray2 = []
    tempArray.forEach(item => {
        tempArray2.push(newIDsObject(item))
    })
    // Put the new items array into the temp object (will use the new IDs as the object keys)
    tempObject.items = arrayToObject(tempArray2)

    // Return the obect
    return tempObject
}

// #endregion modifier functions

// #region general helper functions
// The general helper functions do anything that is not in another category

export function dontClickThrough(e){
    e.stopPropagation()    
}
export function newID(){
    return Math.random().toString(36).substr(2, 9)+""+Date.now().toString(36);
    // Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36)
}

// #endregion general helper functions

