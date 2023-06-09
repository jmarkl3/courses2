import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, database, setCourseData, setCoursesData, setUserData, setUserID } from '../../App/DbSlice';
import DisplayPage from '../Content/DisplayPage';
import Navbar from '../Navbar/Navbar';
import { onValue } from 'firebase/database';
import { ref } from 'firebase/database';
import { useParams } from 'react-router-dom';
import { selectCourse } from '../../App/DbSlice';

function Course() {  
  const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
  const userID = useSelector(state => state.dbslice.userID)
  const dispatcher = useDispatch()

  const { courseID } = useParams();
  
  // Load the meta data so all of the course tiles can be displayed
  useEffect(() => {   
    authListener()
    loadCoursesData()
    if(courseID){
      dispatcher(selectCourse(courseID))
      
    }
      
  }, [])

  useEffect(() => {   
    loadUserData()
  }, [userID])

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

  function loadUserData(){
    if(!userID) return
    onValue(ref(database, 'coursesApp/userData/'+userID), (snapshot) => {
      const data = snapshot.val();   
      setTimeout(() => {
        dispatcher(setUserData(data))

      }, 250)

    })    

  }

  // landingPage css class

  return (
    <div className="App"> 
      <Navbar></Navbar>      
      <DisplayPage></DisplayPage>      
    </div>
  );
}

export default Course;
