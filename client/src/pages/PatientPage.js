import React, { useState, useEffect } from "react";
import { FaHouseChimneyMedical, FaUserInjured } from "react-icons/fa6";
import { FaUserMd, FaUser } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

const AppointmentBookingPopup = ({ selectedDoctor, handleConfirmAppointment, setPopupOpen, patientName, patientEmail, appointmentPopupOpen }) => {
  const [selectedDate, setSelectedDate] = useState(""); // Define selectedDate state

  const handleConfirm = async (event) => {
    event.preventDefault();
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
    console.log(appointmentDetails);
    try {
      await handleConfirmAppointment(appointmentDetails);
      setPopupOpen(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="popup" style={{ display: appointmentPopupOpen ? 'block' : 'none' }}>
      <div className="popup-inner">
      <form onSubmit={handleConfirm}>
  <div>
    <label htmlFor="patientName">Patient Name:</label>
    <input type="text" id="patientName" value={patientName} readOnly />
  </div>
  <div>
    <label htmlFor="patientEmail">Patient Email:</label>
    <input type="email" id="patientEmail" value={patientEmail} readOnly />
  </div>
  <div>
    <label htmlFor="doctorName">Doctor Name:</label>
    <input type="text" id="doctorName" value={selectedDoctor.name} readOnly />
  </div>
  <div>
    <label htmlFor="doctorEmail">Doctor Email:</label>
    <input type="email" id="doctorEmail" value={selectedDoctor.email} readOnly />
  </div>
  <div>
    <label htmlFor="selectedDate">Select Date:</label>
    <input type="date" id="selectedDate" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
  </div>
  <div>
    <button type="submit">Confirm</button>
    <button type="button" onClick={() => setPopupOpen(false)}>Close</button>
  </div>
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
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]); // State to hold fetched appointments
  const [services, setServices] = useState([]); // State to hold fetched services
 

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

  const handleConfirmAppointment = async (appointmentDetails) => {
    console.log('Appointment details:', appointmentDetails);

    try {
      const response = await axios.post('http://localhost:8080/book-appointment', appointmentDetails);

      console.log(response);
      if (response.status === 200) {
        console.log('Appointment booked successfully!');
      } else {
        console.error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
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
  
  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/services');
      if (response && response.data && response.data.services) {
        setServices(response.data.services);
      } else {
        console.error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceBooking = async (serviceName) => {
    try {
      const bookingDetails = {
        patientName,
        patientEmail,
        serviceName // Assuming each service has a unique ID
      };
      const response = await axios.post('http://localhost:8080/api/book-service', bookingDetails);
      if (response.status === 200) {
        console.log('Service booked successfully!');
        window.alert("Service Booked!")
        // Optionally, you can update the UI to reflect the booked service
      } else {
        console.error('Failed to book service');
      }
    } catch (error) {
      console.error('Error booking service:', error);
      // Handle error
    }
  };

 

  useEffect(() => {
    const user = location.state?.user;
    if (user) {
      localStorage.setItem("patientName", user.username);
      localStorage.setItem("patientEmail", user.email);
      setPatientName(user.username);
      setPatientEmail(user.email);
    } else {
      const storedEmail = localStorage.getItem("patientEmail");
      const storedName = localStorage.getItem("patientName");
      if (storedEmail && storedName) {
        setPatientEmail(storedEmail);
        setPatientName(storedName);
      } else {
        navigate("/login");
      }
    }
    fetchDoctors();
    fetchAppointments();
    fetchServices();
  }, [location, navigate]);
  

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
                    <FaUser style={{ marginRight: '5px' }} />
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
            <li><Link to="#doctor" onClick={() => handleSectionClick('doctor')}><FaUserMd style={{ marginRight: '7px', fontSize: '23px' }} /><span className="icon-text">DOCTORS</span></Link></li>
            <li><Link to="#appointment" onClick={() => handleSectionClick('appointment')}><FaUserInjured style={{ marginRight: '7px', fontSize: '23px' }} /><span className="icon-text">APPOINTMENTS</span></Link></li>
            <li><Link to="#service" onClick={() => handleSectionClick('service')}><FaUserInjured style={{ marginRight: '7px', fontSize: '23px' }} /><span className="icon-text">SERVICES</span></Link></li>
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
            appointmentPopupOpen={appointmentPopupOpen}
          />
        )}


        
      <div className="container-fluid justify-content-center">
        <section className="appointment" id="appointment" style={{ display: selectedSection === 'appointment' ? 'block' : 'none' }}>
          <h1 className="py-5 mx-5">APPOINTMENTS</h1>
          <div className="row">
            {appointments
              .filter(appointment => appointment.patientEmail === patientEmail) // Filter appointments by patientEmail
              .map((appointment, index) => (
                <div key={index} className="col-md-4">
                  <div className="appointment-details">
                    <p><strong>Doctor Name:</strong> {appointment.doctorName}</p>
                    <p><strong>Doctor Email:</strong> {appointment.doctorEmail}</p>
                    <p><strong>Date:</strong> {appointment.selectedDate}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>


        <div className="container-fluid justify-content-center">
          <section className="service" id="service" style={{ display: selectedSection === 'service' ? 'block' : 'none' }}>
          <h1 className="py-5 mx-5">SERVICES</h1>
            <div className="row">
              {services.map((service, index) => (
                <div key={index} className="col-md-4">
                  <div className="service-details">
                    <h2>{service.name}</h2>
                    <button className="btn" onClick={() => handleServiceBooking(service.name)}>Book Service</button>
                    {/* Display more service details if available */}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PatientPage;