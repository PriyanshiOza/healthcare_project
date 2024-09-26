import React, { useState, useEffect } from "react";
import { FaHouseChimneyMedical ,  FaUserInjured} from "react-icons/fa6";
import { FaUserMd } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import './DoctorPage.css';
import axios from 'axios';
// import { useAuth } from "../contexts/AuthContext";




const DoctorPage = () => {

 
  const [selectedSection, setSelectedSection] = useState('patient');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user ;
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  

  const handleLogout = async () => {
    
    navigate("/login");
  }
 

  // Fetch patients

  const fetchPatients = async () => {
    // Function to fetch patients data
    try {
      const response = await axios.get('http://localhost:8080/patients');
      if (response.data && response.data.patients) {
        setPatients(response.data.patients);
      } else {
        console.error('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8080/appointments', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments);
      } else {
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  }



  // useEffect(() => {
  //   if (user) {
  //     setDoctorName(user.username); // Set the doctor name when the component mounts
  //   }
    
  //   fetchPatients();
  //   fetchAppointments();
   
    
  // }, [user]);

  useEffect(() => {
    const user = location.state?.user;
    if (user) {
      localStorage.setItem("patientName", user.username);
      localStorage.setItem("patientEmail", user.email);
      setDoctorName(user.username);
      setDoctorEmail(user.email);
    } else {
      const storedEmail = localStorage.getItem("patientEmail");
      const storedName = localStorage.getItem("patientName");
      if (storedEmail && storedName) {
        setDoctorEmail(storedEmail);
        setDoctorName(storedName);
      } else {
        navigate("/login");
      }
    }
    fetchPatients();
    fetchAppointments();
  }, [location, navigate]);

  
  

  return (
  <>
    <div className="doctor-page">
      <header>
        <div className="nav1">
        <div className="logo">
          <span className="icon-wrapper">
            <FaHouseChimneyMedical size={32} />
          </span>
          HealthHub
        </div>
        <div className="logo2">
          <ul className="navbar-nav flex-row">
            <li className="nav-item mx-3">
              <p className="nav-link mx-3">
              <span className="icon-wrapper2" >
              <FaUser style={{ marginRight: '5px' }}/> </span>
                Welcome Doctor : {doctorName && `${doctorName}!`}
              </p>
            </li>
            <li className="nav-item mx-3">
              <button className="btn " onClick={handleLogout}>
                Logout
              </button>
            </li>
           </ul> 
           </div>  
        </div>
        <div className="nav2">
  <ul>
    
    <li><a href="#patient" onClick={() => handleSectionClick('patient')}><FaUserInjured style={{ marginRight: '7px' , fontSize: '23px'}}/><span className="icon-text">PATIENTS</span></a></li>
    <li><a href="#appointment" onClick={() => handleSectionClick('appointment')}><FaUserMd style={{ marginRight: '7px', fontSize: '23px' }}/><span className="icon-text">APPOINTMENTS</span></a></li>
    
  </ul>
</div>

      </header>
      <div className="container-doctor">
       
        

        <div className="container-fluid justify-content-center">

            <section className="patient" id="patient" style={{ display: selectedSection === 'patient' ? 'block' : 'none' }}>
                <div className="container-fluid">
                  <p className="py-5 mx-5 heading">Patients List</p>
                  <div className="row">
                      {patients.map((patient, index) => (
                        <div key={index} className="col-md-4 mb-4">
                          <div className="patient-details">
                            <p><strong>Name : </strong>{patient.username}</p>
                            <p><strong>Email : </strong> {patient.email}</p>
                            {/* Add more patient details if needed */}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
            </section>

          </div>


          <div className="container-fluid justify-content-center">
  <section className="appointment" id="appointment" style={{ display: selectedSection === 'appointment' ? 'block' : 'none' }}>
    <h1 className="py-5 mx-5">APPOINTMENTS</h1>
    <div className="row">
      {appointments
        .filter(appointment => appointment.doctorEmail === doctorEmail) // Filter appointments by patientEmail
        .map((appointment, index) => (
          <div key={index} className="col-md-4">
            <div className="appointment-details">
              <p><strong>Patient Name :</strong> {appointment.patientName}</p>
              <p><strong>Patient Email :</strong> {appointment.patientEmail}</p>
              <p><strong>Date :</strong> {appointment.selectedDate}</p>
            </div>
          </div>
        ))}
    </div>
  </section>
</div>

          
        
      </div>
    </div>

  </>
  )
}

export default DoctorPage;