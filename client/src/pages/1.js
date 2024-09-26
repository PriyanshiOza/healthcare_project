import React, { useState, useEffect } from "react";
import { FaHouseChimneyMedical , FaUserTie , FaUserInjured} from "react-icons/fa6";
import { FaUserMd , FaUser  } from "react-icons/fa";
import { Link, useNavigate} from "react-router-dom";
import './PatientPage.css';
import docImage from "./1.jpg";




const DoctorDetailsPopup = ({ selectedDoctor, handleAppointmentBooking, setPopupOpen, selectedDate }) => (
  
  <div className="popup">
    <div className="popup-inner">
      <img src={docImage} alt="Doctor" />
      <h1>{selectedDoctor.name}</h1>
      <p><strong>E-Mail : </strong>{selectedDoctor.email}</p>
      <p><strong>Specialization : </strong>{selectedDoctor.specialization}</p>
      <p><strong>Availability : </strong>{selectedDoctor.availability}</p>
      <p><strong>Contact : </strong>{selectedDoctor.contact}</p>
      <button className="book" onClick={() => handleAppointmentBooking(selectedDoctor, selectedDate)}>Book Appointment</button><br />
      <button onClick={() => setPopupOpen(false)}>Close</button>
    </div>
  </div>
);

const AppointmentBookingPopup = ({ selectedDoctor, handleConfirmAppointment, setPopupOpen, selectedDate, setSelectedDate }) => {


  const handleConfirm = () => {
    if (!selectedDate) {
      window.alert('Please select a date for the appointment.');
      return;
    }
    handleConfirmAppointment();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <img src={docImage} alt="Doctor" />
        <h1>{selectedDoctor.name}</h1>
        <p><strong>E-Mail : </strong>{selectedDoctor.email}</p>
        <p><strong>Specialization : </strong>{selectedDoctor.specialization}</p>
        <p><strong>Availability : </strong>{selectedDoctor.availability}</p>
        <p><strong>Contact : </strong>{selectedDoctor.contact}</p>
        <label className="mx-3"><strong>Date :</strong></label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /><br/>
        <button className="book" onClick={handleConfirm}>Confirm</button><br />
        <button onClick={() => setPopupOpen(false)}>Close</button>
      </div>
    </div>
  );
};





const PatientPage = () => {

  const [patientProfile, setPatientProfile] = useState(null);
  const [selectedSection, setSelectedSection] = useState('profile');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [readMorePopupOpen, setReadMorePopupOpen] = useState(false);
  const [appointmentPopupOpen, setAppointmentPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const navigate = useNavigate();


  const fetchPatientProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/patient/profile', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPatientProfile(data.patient);
      } else {
        console.error('Failed to fetch admin profile');
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8080/doctors', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };


 


  const handleLogout = () => { 
    navigate("/login");
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleReadMore = (doctor) => {
    setSelectedDoctor(doctor);
    setReadMorePopupOpen(true);
    setAppointmentPopupOpen(false); // Close appointment popup if open
  };

  const handleAppointmentBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setReadMorePopupOpen(false); // Close the "Read More" popup
    setAppointmentPopupOpen(true);
  };


  const handleConfirmAppointment = async () => {
    try {
      if (!selectedDoctor || !selectedDate) {
        window.alert('Please select doctor and date.');
        return;
      }

      const response = await fetch('http://localhost:8080/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          date: selectedDate
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Appointment booked successfully:', data);
        setAppointmentPopupOpen(false);
        setReadMorePopupOpen(false);
        window.alert('Appointment confirmed!');
      } else {
        console.error('Failed to book appointment');
        window.alert('Failed to book appointment. Please try again later.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      window.alert('Failed to book appointment. Please try again later.');
    }
  };
  


  useEffect(() => {
    fetchPatientProfile();
    fetchDoctors();
    
  }, []);


  
  

  return (
  <>

      <div className="patient-page">

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
                    Welcome Patient!
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
              <li><Link to="#profile" onClick={() => handleSectionClick('profile')}> <FaUserTie style={{ marginRight: '7px', fontSize: '23px' }}/><span className="icon-text">PROFILE</span></Link></li>
              <li><Link to="#doctor" onClick={() => handleSectionClick('doctor')}><FaUserMd style={{ marginRight: '7px', fontSize: '23px' }}/><span className="icon-text">DOCTORS</span></Link></li>
              <li><Link to="#appointment" onClick={() => handleSectionClick('appointment')}><FaUserInjured style={{ marginRight: '7px', fontSize: '23px' }}/><span className="icon-text">APPOINTMENTS</span></Link></li>
              <li><Link to="#prescription" onClick={() => handleSectionClick('prescription')}><FaUserInjured style={{ marginRight: '7px', fontSize: '23px' }}/><span className="icon-text">PRESCRIPTION</span></Link></li>
            </ul>
          </div>
        </header>

        <div className="container-patient">

              {/* PROFILE SECTION */}
              <div className="container-fluid justify-content-center">
                  
                    <section className="profile" id="profile" style={{ display: selectedSection === 'profile' ? 'block' : 'none' }}>
                        <div className="row ">
                          <div className="col-4 one">
                            <div className="profile-picture1"></div>
                          </div>
                          <div className="col-8 two">
                            <div className="profile-info1"> 
                              {patientProfile && (
                                <div className="lead">
                                  <h1><b>PATIENT PROFILE</b></h1>
                                  <p><b>NAME :  </b>{patientProfile.username}</p>
                                  <p><b>E-MAIL : </b> {patientProfile.email}</p>
                                </div>
                              )} 
                            </div>  
                          </div>
                        </div>
                    </section>
                  
              </div>

              {/*DOCTORS SECTION */}
              <div className="container-fluid justify-content-center">
              {!appointmentPopupOpen && !readMorePopupOpen && (
              <div className="container-fluid justify-content-center">
                <section className="doctor" id="doctor" style={{ display: selectedSection === 'doctor' ? 'block' : 'none' }}>
                  <div className="row">
                    <h1 className="py-5 mx-5">DOCTORS</h1>
                    {doctors.map((doctor, index) => (
                      <div key={index} className="col-md-4">
                        <div className="doctor-details">
                          <h2>{doctor.name}</h2>
                          <p><strong>Specialization : </strong> {doctor.specialization}</p>
                          <p className="info"><Link onClick={() => handleReadMore(doctor)}>Read More</Link></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
              </div>

              {/* Additional information of selected doctor */}
              {selectedDoctor && readMorePopupOpen && (
                <DoctorDetailsPopup
                  selectedDoctor={selectedDoctor}
                  handleAppointmentBooking={handleAppointmentBooking}
                  setPopupOpen={setReadMorePopupOpen}
                />
              )}
              {selectedDoctor && appointmentPopupOpen && (
                <AppointmentBookingPopup
                  selectedDoctor={selectedDoctor}
                  handleConfirmAppointment={handleConfirmAppointment}
                  setPopupOpen={setAppointmentPopupOpen}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate} // Make sure setSelectedDate is passed here
                />
              )}



              
              

              <div className="container-fluid justify-content-center">
                 
                  <section className="appointment" id="appointment" style={{ display: selectedSection === 'appointment' ? 'block' : 'none' }}>
                  
                  </section>
              </div>


              <div className="container-fluid justify-content-center">
                  <section className="prescription" id="prescription" style={{ display: selectedSection === 'prescription' ? 'block' : 'none' }}>
                  

                          
                  
                  </section>
              </div>
          
        </div>

      </div>



  </>
  )
};

export default PatientPage;