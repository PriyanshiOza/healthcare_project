import React, { useState, useEffect } from "react";
import { FaHouseChimneyMedical , FaUserInjured} from "react-icons/fa6";
import { FaUserMd , FaUser  } from "react-icons/fa";
import { Link, useNavigate, useLocation} from "react-router-dom";
import './PatientPage.css';
import docImage from "./1.jpg";
import axios from 'axios';

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

const AppointmentBookingPopup = ({ selectedDoctor, handleConfirmAppointment, setPopupOpen, patientName, patientEmail }) => {
  const [selectedDate, setSelectedDate] = useState(""); // Define selectedDate state

  

  const handleConfirm = () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    const appointmentDetails = {
      patientName,
      patientEmail,
      doctorName: selectedDoctor.name,
      doctorEmail: selectedDoctor.email,
      selectedDate
    };
    handleConfirmAppointment(appointmentDetails);
    setPopupOpen(false);
  };

  return (
    <div className="popup">
      <div className="popup-inner">
      
        
        <form onSubmit={handleConfirm}>
          <label htmlFor="patientName">Patient Name:</label>
          <input type="text" id="patientName" value={patientName} readOnly /><br/><br/>
          <label htmlFor="patientEmail">Patient Email:</label>
          <input type="email" id="patientEmail" value={patientEmail} readOnly /><br/><br/>
          <label htmlFor="doctorName">Doctor Name:</label>
          <input type="text" id="doctorName" value={selectedDoctor.name} readOnly /><br/><br/>
          <label htmlFor="doctorEmail">Doctor Email:</label>
          <input type="email" id="doctorEmail" value={selectedDoctor.email} readOnly /><br/><br/>
          <label htmlFor="selectedDate">Select Date:</label>
          <input type="date" id="selectedDate" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required /><br/><br/>
          <button type="submit">Confirm</button><br/>
          <button onClick={() => setPopupOpen(false)}>Close</button><br/>
        </form>
      </div>
    </div>
  );
};

const PatientPage = () => {
  const [selectedSection, setSelectedSection] = useState('doctor');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [readMorePopupOpen, setReadMorePopupOpen] = useState(false);
  const [appointmentPopupOpen, setAppointmentPopupOpen] = useState(false);
  const location = useLocation();
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const user = location.state?.user ;
  const navigate = useNavigate();

  const handleConfirmAppointment = async (appointmentDetails) => {
    console.log('Appointment details:', appointmentDetails);
    try {
      const response = await axios.post('http://localhost:8080/book-appointment', { data: appointmentDetails });

      console.log(response);
      if (response.status === 200) {
        console.log('Appointment booked successfully!');
      } else {
        console.error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
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

  useEffect(() => {
    const user = location.state?.user;
    if (user) {
      setPatientName(user.username);
      setPatientEmail(user.email);
    } else {
      const storedEmail = localStorage.getItem("patientEmail");
      if (storedEmail) {
        setPatientEmail(storedEmail);
      } else {
        navigate("/login");
      }
    }
    fetchDoctors();
  }, [location, navigate, user]);

  const handleLogout = () => { 
    localStorage.removeItem("patientName");
    navigate("/login");
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleReadMore = (doctor) => {
    setSelectedDoctor(doctor);
    setReadMorePopupOpen(true);
    setAppointmentPopupOpen(false);
  };

  const handleAppointmentBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setReadMorePopupOpen(false);
    setAppointmentPopupOpen(true);
  };

  return (
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
                    <FaUser style={{ marginRight: '5px' }}/> 
                  </span>
                  Welcome Patient :  {patientName && `${patientName}!`}
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
            <li><Link to="#doctor" onClick={() => handleSectionClick('doctor')}><FaUserMd style={{ marginRight: '7px', fontSize: '23px' }}/><span className="icon-text">DOCTORS</span></Link></li>
            <li><Link to="#appointment" onClick={() => handleSectionClick('appointment')}><FaUserInjured style={{ marginRight: '7px', fontSize: '23px' }}/><span className="icon-text">APPOINTMENTS</span></Link></li>
            <li><Link to="#prescription" onClick={() => handleSectionClick('prescription')}><FaUserInjured style={{ marginRight: '7px', fontSize: '23px' }}/><span className="icon-text">PRESCRIPTION</span></Link></li>
          </ul>
        </div>
      </header>
      <div className="container-patient">
        <div className="container-fluid justify-content-center">
          {!appointmentPopupOpen && !readMorePopupOpen && (
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
          )}
        </div>
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
            setPopupOpen={setAppointmentPopupOpen}
            handleConfirmAppointment={handleConfirmAppointment}
            patientName={patientName}
            patientEmail={patientEmail}
          />
        )}
        <div className="container-fluid justify-content-center">
          <section className="appointment" id="appointment" style={{ display: selectedSection === 'appointment' ? 'block' : 'none' }}>
            <h1 className="py-5 mx-5">APPOINTMENTS</h1>
            <ul></ul>
          </section>
        </div>
        <div className="container-fluid justify-content-center">
          <section className="prescription" id="prescription" style={{ display: selectedSection === 'prescription' ? 'block' : 'none' }}>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PatientPage;