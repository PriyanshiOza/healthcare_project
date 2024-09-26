import React, { useState , useEffect} from "react";

const EditDoctorForm = ({ doctor, onSubmit, onCancel }) => {
    const [id , setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [availability, setAvailability] = useState("");
    const [contact, setContact] = useState("");


    useEffect(() => {
      if (doctor) {
        setId(doctor.id || "");
        setName(doctor.name || "");
        setEmail(doctor.email || "");
        setSpecialization(doctor.specialization || "");
        setAvailability(doctor.availability || "");
        setContact(doctor.contact || "");
      }
    }, [doctor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form...");
        // Prepare the updated doctor object
        const updatedDoctor = {
          id,
          name,
          email,
          specialization,
          availability,
          contact
        };
        console.log("Updated Doctor Data:", updatedDoctor);
        onSubmit(updatedDoctor);
        console.log("Form submitted successfully!");
      };

     

  return (
    <form onSubmit={handleSubmit}>
      
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
      <button type="submit" className="btn btn-primary">Update</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditDoctorForm;
