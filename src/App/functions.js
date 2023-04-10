// #region conversion functions (The conversion functions convert one data type to another)

/**
 * Input is an object, output is an array sorted by index
 */
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
    if(!courseData) return null
    // If there is no chapterID, return the courseData
    if(!chapterID || !courseData?.items) return {...courseData}

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

/**
 * Gets the next item in the object based on the ID
 * @param {Object} object The object to look through
 * @param {String} afterID The ID of the item before the item that will be returned
 */ 
export function getNextItem(object, afterID){
    // The object to be returned if the afterID is found
    var toReturn = null
    // Flag set when afterID is found
    var returnNext = false

    // Look through each item in the object
    Object.entries(object).forEach(([key, value]) => {
        // If the id was found on the last itteration save this item
        if(returnNext)
        toReturn = value
        // If the id was found set the flag to save the next item
        if(key === afterID)
            returnNext = true        
        else
            returnNext = false
    })

    // Return the item
    return toReturn

}
/**
 * Gets the last item in the object based on the ID
 * @param {Object} object The object to look through
 * @param {String} afterID The ID of the item after the item that will be returned
 */ 
export function gePreviousItem(object, afterID){
    // The object to be returned if the afterID is found
    var toReturn = null
    // Save each item so if the afterID is found there is access to the previous item
    var lastItem = null

    // Look through each item in the object
    Object.entries(object).forEach(([key, value]) => {
        // If the id was found save the last item so it is returned
        if(key === afterID)
           toReturn = lastItem
        // Save this item so there is access to it on the next itteration
        lastItem = value
        
    })

    // Return the item
    return toReturn

}

export function getLastItemID(object){
    var tempArray = objectToArray(object)
    if(!tempArray || !tempArray.length) return null
    return tempArray[tempArray.length - 1].id
}

export function getChapter(courseData, chapterID){
    var chapter = courseData?.items[chapterID]    
    return  {...chapter}
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
/**
 * Returns an object with any undefined items removed
 * @param {*} object 
 * @returns 
 */
export function removeUndefined(object){
    if(typeof(object) !== "Object") return object
    var tempArray = []
    Object.entries(object).forEach(([key, value]) => {
        if(value !== undefined){
            var tempValue = removeUndefined(value)
            tempArray.push(tempValue)
        }
    })
    return arrayToObject(tempArray)
}
/**
 * Takes in an object, item, and ID
 * Returns an object with the item inserted after the item with the ID
 * @param {*} object 
 * @param {*} itemToInsert 
 * @param {*} itemToInsertAfterID 
 * @returns 
 */
export function insertItem(object, itemToInsert, itemToInsertAfterID){

    // Create an array from the object (will be sorted by current index)
    var itemArray = objectToArray(object)
    
    var tempArray = []

    // If the itemToInsertAfterID == -1 it is a flag to insert the item at the beginning of the array
    if(itemToInsertAfterID == -1)
        itemArray.push(itemToInsert)

    // Flag variable to determine index offset
    var indexOffset = 0
    var insertedItem = false
    var indexCounter = 0
    // Put each item in the array with an updated index
    itemArray.forEach((item, index) => {        
        // If this is not the item to insert
        if(item?.id !== itemToInsert?.id){
            // Set the index based on array index plus the index offset
            item.index = indexCounter
            // Increment the index counter
            indexCounter++
            
            // Push the item to the temp array
            tempArray.push(item)

        }

        // If the id of the current item is the id of the item to insert after, insert the new item
        if(item.id === itemToInsertAfterID && itemToInsertAfterID != -1){  
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
export function isEmptyString(string){
    if(!string) return true
    if(typeof string === "string" && string.trim() === "") return true
}

// #endregion general helper functions

// #region user data functions

/**
 * Returns the user data at the specified location from the database
 * ex:  getUserData(userData, "responses/courseID/sectionID/elementID")
 */
export function getUserData(userData, path){
    if(!userData || !path) return
    var tempData = userData
    var pathArray = path.split("/")
    pathArray.forEach(item => {
        if(tempData)
            tempData = tempData[item]
    })
    return tempData
}

// #endregion user data functions