// Import necessary modules
import React, { useState, useEffect } from "react";
import { FaHouseChimneyMedical , FaUserInjured} from "react-icons/fa6";
import { FaUserMd , FaUser } from "react-icons/fa";
import { useNavigate,useLocation } from "react-router-dom";
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  // State variables

  const [selectedSection, setSelectedSection] = useState('doctor');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null); // New state for edit data
  const location = useLocation();
  const user = location.state?.user;
  const [adminName, setAdminName] = useState("");
  const [adminEmail , setAdminEmail] = useState("");
  const [services, setServices] = useState([]); // New state for services
  const [serviceName, setServiceName] = useState(""); 

  // Function to check if the user is logged in as admin
  const isAdmin = user && user.account === 'admin';

  // const [ id,setId] = useState("");
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [specialization , setSpecialization] = useState("");
  const [availability , setAvailability] = useState("");
  const [contact , setContact] = useState("");

 

  useEffect(() => {
    if (isAdmin) {
      setAdminName(user.username); // Set the admin name when the component mounts
    }
  }, [isAdmin, user]);

  // Handle form opening
  const handleForm = () => {
    // Reset the editData state to null to indicate that it's not an edit operation
    setEditData(null);
    setShowModal(true);
    clearInputFields();
   
  };

  // Handle form closing
  const handleCloseModal = () => {
    setShowModal(false);
    clearInputFields(); // Clear input fields when closing modal
  };

  const clearInputFields = () => {
    setName("");
    setEmail("");
    setSpecialization("");
    setAvailability("");
    setContact("");
  };

  // Handle form submission for adding/editing doctor
  const handleModalSubmit = async () => {
    try {
      if(!name || !email || !specialization ||!availability ||!contact) {
        return alert("Please provide all details");
      }
      
      const response = await axios.post('http://localhost:8080/admin/add', { name, email, specialization, availability, contact });
      if (response && response.data && response.data.success) {
        alert('Doctor added Successfully');
        setShowModal(false);
        fetchDoctors(); // Refresh doctors list
      } else {
        alert('Failed to add doctor');
      }
    } catch (error) {
      console.log(error);  
    }
  };

// Handle edit doctor
const handleEditDoctor = (doctor) => {
  setShowModal(true);
  // Update the editData state without modifying the input fields
  setEditData({
    id: doctor._id,
    name: doctor.name,
    email: doctor.email,
    specialization: doctor.specialization,
    availability: doctor.availability,
    contact: doctor.contact
  });
};

// Handle update doctor
const handleUpdateDoctor = async () => {
  try {
    // Check if editData exists and all required fields are present
    if (!editData || !editData.name || !editData.email || !editData.specialization || !editData.availability || !editData.contact) {
      return alert("Please provide all details");
    }

    // Update the editData object with new values from input fields
    const updatedData = {
      ...editData,
      name,
      email,
      specialization,
      availability,
      contact
    };
   

    // Log the editData object before making the PUT request
    console.log("Edit Data:", updatedData);

    // Make a PUT request to update the doctor details in the database
    const response = await axios.put(`http://localhost:8080/doctors/${editData.id}`, updatedData);

    if (response && response.data && response.data.success) {
      alert('Doctor details updated successfully');
      setShowModal(false);
      // After successfully updating the doctor details, fetch the updated list of doctors
      fetchDoctors(); // Refresh doctors list
    } else {
      alert('Failed to update doctor details');
    }
  } catch (error) {
    console.error('Error updating doctor details:', error);
    alert('Failed to update doctor details');
  }
};








  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/doctors');
      if (response.data && response.data.doctors) {
        setDoctors(response.data.doctors);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };


  // Logout function
  const handleLogout = () => {
    navigate("/login");
  };

  // Section click handler function
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };
  
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

  // Function to fetch services from the backend
  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/services');
      if (response.data && response.data.services) {
        setServices(response.data.services); // Update state with fetched services
      } else {
        console.error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };


  // Handle form submission for adding a new service
const handleServiceSubmit = async () => {
  try {
    if (!serviceName) {
      return alert("Please provide a service name");
    }

    const response = await axios.post('http://localhost:8080/api/services', { name: serviceName });
    
    if (response && response.data && response.data.success) {
      alert('Service added successfully');
      setShowModal(false);
      fetchServices(); // Refresh services list
    } else {
      alert('Failed to add service');
    }
  } catch (error) {
    console.error('Error adding service:', error);
    alert('Failed to add service');
  }
};




  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setEmail(editData.email || "");
      setSpecialization(editData.specialization || "");
      setAvailability(editData.availability || "");
      setContact(editData.contact || "");
    }
  
    fetchDoctors();
    fetchPatients();
    fetchServices();
  
    
      
   
  }, [editData]);

  useEffect(() => {
    const user = location.state?.user;
    if (user) {
      localStorage.setItem("patientName", user.username);
      localStorage.setItem("patientEmail", user.email);
      setAdminName(user.username);
      setAdminEmail(user.email);
    } else {
      const storedEmail = localStorage.getItem("patientEmail");
      const storedName = localStorage.getItem("patientName");
      if (storedEmail && storedName) {
        setAdminEmail(storedEmail);
        setAdminName(storedName);
      } else {
        navigate("/login");
      }
    }
   
  }, [location, navigate]);
  

  


  return (
    <>
      <div className="admin-page">

        {/* Header */}

        <header>
          <div className="nav1">
            <div className="logo">
              <span className="icon-wrapper">
                <FaHouseChimneyMedical size={35} />
              </span>
              HealthHub
            </div>
            <div className="logo2">
              <ul className="navbar-nav flex-row">
                <li className="nav-item mx-3">
                  <p className="nav-link mx-3">
                    <span className="icon-wrapper2" >
                      <FaUser style={{ marginRight: '5px' }} /> </span>
                    Welcome Admin :   {adminName && `${adminName}!`}
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
              
              <li><a href="#doctor" onClick={() => handleSectionClick('doctor')}><FaUserMd style={{ marginRight: '7px', fontSize: '23px' }} /><span className="icon-text">DOCTORS</span></a></li>
              <li><a href="#patient" onClick={() => handleSectionClick('patient')}><FaUserInjured style={{ marginRight: '7px', fontSize: '23px' }} /><span className="icon-text">PATIENTS</span></a></li>
              <li><a href="#service" onClick={() => handleSectionClick('service')}><FaUserInjured style={{ marginRight: '7px', fontSize: '23px' }} /><span className="icon-text">SERVICES</span></a></li>
            </ul>
          </div>
        </header>

        {/* Main content */}

        <div className="container-admin">

         
          
          {/* Doctor section */}

          <div className="container-fluid justify-content-center"> 

              <section className="doctor" id="doctor" style={{ display: selectedSection === 'doctor' ? 'block' : 'none' }}>

                {/* Add Doctor Form */}

                <br/>
                  <div className="row">
                    <h2 className="ms-4 px-2 heading" style={{ cursor: "pointer" , color:"green" } } onClick={handleForm}>
                      <i className="fa-solid fa-plus py-4 px-4 " ></i>
                      Add Doctors
                    </h2>
                    {showModal && (
                      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">{editData ? 'Edit Doctor' : 'Add Doctor'} Form</h5>
                            </div>

                            <div className="modal-body">
                              <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="NAME" value={name} onChange={(e) => setName(e.target.value)} />
                                <label htmlFor="floatingInput">NAME</label>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <label htmlFor="floatingPassword">EMAIL</label>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="SPECIALIZATION" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                                <label htmlFor="floatingSpec">SPECIALIZATION</label>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="AVAILABILITY" value={availability} onChange={(e) => setAvailability(e.target.value)} />
                                <label htmlFor="floatingPassword">AVAILABILITY</label>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingInput" placeholder="CONTACT" value={contact} onChange={(e) => setContact(e.target.value)} />
                                <label htmlFor="floatingPassword">CONTACT</label>
                              </div>
                            </div>

                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary" onClick={editData ? handleUpdateDoctor : handleModalSubmit}>{editData ? 'Update' : 'Save'}</button>
                              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                {/* Doctors List */}
                 
                <br/><br/>
                    <div className="row list">
                    {doctors.map((doctor,index) => (
                      <div key={index} className="col-md-4">
                        <div className="doctor-details">
                          <h2>{doctor.name}</h2>
                          <p><strong>Email: </strong>{doctor.email}</p>
                          <p><strong>Specialization: </strong>{doctor.specialization}</p>
                          <p><strong>Availability: </strong>{doctor.availability}</p>
                          <p><strong>Contact: </strong>{doctor.contact}</p>
                          <button className="edit-btn" onClick={() => handleEditDoctor(doctor)}>Edit</button>
                        </div>
                      </div>
                    ))}

                    </div>

          
              </section>

          </div>

          {/* Patient section */}

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

            <section className="service" id="service" style={{ display: selectedSection === 'service' ? 'block' : 'none' }}>
              <div className="row">
                <h2 className="ms-4 px-2 heading" style={{ cursor: "pointer" , color:"green" } } onClick={handleForm}>
                      <i className="fa-solid fa-plus py-4 px-4 " ></i>
                      Add Services
                    </h2>
              </div>
              {/* Display services */}
              <div className="row list">
                {services.map((service, index) => (
                  <div key={index} className="col-md-4">
                    <div className="service-details">
                      <h2>{service.name}</h2>
                      
                      {/* Add more service details if needed */}
                    </div>
                  </div>
                ))}
                </div>

              {showModal && (
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Service Form</h5>
                </div>

                <div className="modal-body">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Service Name"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Service Name</label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleServiceSubmit}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
              
            </section>
          </div>

        </div> 

      </div>
    </>
  );
};

export default AdminPage;