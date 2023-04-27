import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, database, setCourseData, setCoursesData, setUserData, setUserID } from '../../App/DbSlice';
import DisplayPage from '../Content/DisplayPage';
import Navbar from '../Navbar/Navbar';
import { onValue } from 'firebase/database';
import { ref } from 'firebase/database';
import AuthMenu from '../Auth/AuthMenu';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import { setEditMode } from '../../App/AppSlice';
import { selectCourse } from '../../App/DbSlice';

function Course() {  
  const selectedCourseID = useSelector(state => state.dbslice.selectedCourseID)
  const userID = useSelector(state => state.dbslice.userID)
  const editMode = useSelector(state => state.appslice.editMode)
  const previewMode = useSelector(state => state.appslice.previewMode)
  const theme = useSelector(state => state.appslice.theme)
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

  function authListener(){
    onAuthStateChanged(auth, (user) => {
      dispatcher(setUserID(user?.uid))

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
      <div className={theme}>
        <DisplayPage></DisplayPage>
      </div>
    </div>
  );
}

export default Course;
