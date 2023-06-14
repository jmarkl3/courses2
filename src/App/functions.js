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
export function timeString(secondsRaw){
    if(typeof secondsRaw === "string") {
        try{
            secondsRaw = parseFloat(secondsRaw)
        } catch {}
    }
    
    if(typeof secondsRaw !== "number") return 0

    // Calcluate the parts of the time string
    var seconds = secondsRaw % 60
    var minutes = Math.floor(secondsRaw / 60) % 60
    var hours = Math.floor(secondsRaw / 3600)

    // If the time requirement has been met display this
    if(secondsRaw <= 0){
        return ""
        return "✔"
    }

    // If there are seconds but no minutes or hours, return the unpadded seconds
    if(seconds >= 0 && minutes == 0 && hours == 0){
        return seconds
    }
    // If there are seconds and minutes but no hours, return m:ss
    else if(seconds >= 0 && minutes > 0 && hours == 0){
        return minutes + ":" + pad(seconds)
    }
    // If there are seconds, minutes and hours, return h:mm:ss
    else{
        return hours + ":" + pad(minutes) + ":" + pad(seconds)
    }
}
function pad(number){
    // return number
    if(!number || number == 0)
        return "00"
    if(number < 10) {
        return "0"+number
    }
    else 
        return number
}
// #endregion conversion functions

// #region getter functions
// The getter functions get things from input data

export function getItem(courseData, chapterID, sectionID, elementID){
    if(!courseData) return {key: "hello"}
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

    var tempArray = objectToArray(object)
    if(!tempArray || !tempArray.length) return

    // Look through each item in the object
    tempArray.forEach((item) => {
        // If the id was found on the last itteration save this item
        if(returnNext)
            toReturn = item
        // If the id was found set the flag to save the next item
        if(item.id === afterID)
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

    var tempArray = objectToArray(object)
    console.log("tempArray")
    console.log(tempArray)
    if(!tempArray || !tempArray.length) return

    // Look through each item in the object
    tempArray.forEach((item) => {
        // If the id was found save the last item so it is returned
        if(item.id === afterID)
           toReturn = lastItem
        // Save this item so there is access to it on the next itteration
        lastItem = item
        
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
    if(typeof object !== "object") return object
    let filteredObject = {}
    Object.entries(object).forEach(([key, value]) => {
        if(value !== undefined && value !== null){
            filteredObject[key] = removeUndefined(value)
        }
    })

    return filteredObject
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
export function priceString(price){
    if(typeof price === "string") {
        try{
            price = parseFloat(price)
        } catch {}
    }
    if(!price) return "$0.00"
    // If it is an even whole number add a .00
    if(price % 1 == 0)
        return "$"+price+".00"
    // If it has only one decimal digit add a second
    if((price / 0.1) % 1 == 0)
        return "$"+price+"0"
    // Otherwise just return the price
    return "$"+price
}
// Converts the given string to the given language
export function languageConverter(language, string){
    if(language === "English")
        return string
    else{
        if(string === "hello")
            return "hola"
        if(string === "About")
            return "Acerca de"
        if(string === "Support")
            return "Apoyo"
        if(string === "Cart")
            return "Carro"
        if(string === "Account")
            return "Cuenta"
        if(string === "If you have been mandated to complete one of our online parenting classes, it is your responsibility to make sure the court or government agency has a copy of your certificate or a record of your completion. OnlineParentingPrograms.com does not file completed certificates on your behalf. If you are unsure how to file your certificate contact the agency that required the program for specific instructions.")
            return "Si se le ordenó completar una de nuestras clases para padres en línea, es su responsabilidad asegurarse de que la corte o la agencia gubernamental tenga una copia de su certificado o un registro de su finalización. OnlineParentingPrograms.com no presenta certificados completos en su nombre. Si no está seguro de cómo presentar su certificado, comuníquese con la agencia que solicitó el programa para obtener instrucciones específicas."
        if(string === "Key Facts")
            return "Hechos clave"
        if(string === "Meets the requirements of courts throughout Colorado")
            return "Cumple con los requisitos de los tribunales de todo Colorado"
        if(string === "Dark theme available for easy reading")
            return "Tema oscuro disponible para facilitar la lectura"
        if(string === "Entire course can be completed online")
            return "Todo el curso se puede completar en línea"
        if(string === "Offered in English and")
            return "Se ofrece en inglés y"
        if(string === "Curriculum reflects the most recent research about children of divorce")
            return "El plan de estudios refleja las investigaciones más recientes sobre los hijos de padres divorciados "
        if(string === "Reduced fee for qualified indigent participants")
            return "Tarifa reducida para participantes indigentes calificados"
        if(string === "Multiple classes offered for different situations")
            return "Múltiples clases ofrecidas para diferentes situaciones."
        if(string === "Automitacally generated certificate of completion")
            return "Certificado de finalización generado automáticamente"
        else{
            console.log(string)
            return string
        }

    }
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

export function getEnrolledCourses(userData){
    if(!userData || !userData?.courses || typeof userData?.courses !== "object") {                    
        return []
    }

    // Get an array of courseIDs that the user is enrolled in
    let tempEnrolledCoursesArray = []
    // Look through each course in their data
    Object.entries(userData?.courses).forEach(course => {
        // If there enrolled in it add the id to the array
        if(course[1].enrolled)
            tempEnrolledCoursesArray.push(course[0])
    })
    return tempEnrolledCoursesArray
}

// #endregion user data functions