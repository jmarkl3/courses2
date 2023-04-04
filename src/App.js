import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { database, setCourseData, setCoursesData } from './App/DbSlice';
import DisplayPage from './Components/Content/DisplayPage';
import Navbar from './Components/Navbar/Navbar';
import { onValue } from 'firebase/database';
import { ref } from 'firebase/database';
/*

  element mapping
    edit mode
    view mode

  user data
    saves
    displays

  section timer
    save in edit mode
    display in view mode
    updates in view mode
    saves into user data

  timed camera

  language support

  account page

*/
/*
  ________________________________________________________________________________
  Misc notes
  
  redux dev tools extension
  https://www.youtube.com/watch?v=BYpuigD01Ew
  custom action dispacher in browser
  https://github.com/zalmoxisus/redux-devtools-extension/commit/477e69d8649dfcdc9bf84dd45605dab7d9775c03

  react dev tools extension
  https://www.youtube.com/watch?v=rb1GWqCJid4

  Random things
  Polimer?
  https://www.youtube.com/watch?v=J4i0xJnQUzU
  copilot x (signed up)
  rokid max
  https://fsymbols.com/signs/triangle/



*/

function App() {  
  const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
  const dispatcher = useDispatch()

  // Load the meta data so all of the course tiles can be displayed
  useEffect(() => {   
    loadCoursesData()
  }, [])

  // Load the data for the selected course
  useEffect(() => {   
    loadCourseData(selectedCourseID)
  }, [selectedCourseID])

  // Loads the meta data so all of the course tiles can be displayed
  function loadCoursesData(){
    onValue(ref(database, 'coursesApp/coursesMetaData'), (snapshot) => {
      const data = snapshot.val();      
      setTimeout(() => {
        dispatcher(setCoursesData(data))

      }, 250)

    })    

  }

  // Loads data for the selected course
  function loadCourseData(courseID){
    onValue(ref(database, 'coursesApp/coursesData/'+courseID), (snapshot) => {
      const data = snapshot.val();   
      setTimeout(() => {
        dispatcher(setCourseData(data))

      }, 250)

    })    

  }

  return (
    <div className="App">
      <Navbar></Navbar>
      <DisplayPage></DisplayPage>
    </div>
  );
}

export default App;
