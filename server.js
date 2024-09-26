const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const UserModel = require('./models/userModels');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const DoctorModel = require('./models/doctorModels');
const serviceRoutes = require('./routes/serviceRoutes');


var nodemailer = require('nodemailer');



// rest object to create server
const app = express();
const authRouter = require('./routes/authRoutes');

dotenv.config();

// MIDDLEWARES 

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET" , "POST" , "PUT" , "PATCH"],
  credentials: true
}
));


// ROUTES 

app.use('/api/auth' , authRouter );
// Routes for service
app.use('/api', serviceRoutes);


// MONGO DB CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));



// GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
   
  });
});







// SERVER

// creating port
const PORT = process.env.PORT || 8080;

// listen method to run application
app.listen(PORT, () => {
    console.log("node server running");

});



// FORGOT PASSWORD ENDPOINT
app.post('/forgot-pass' , (req,res)=>{
    const {email} = req.body;
    UserModel.findOne({email:email})
    .then(user => {
        if(!user){
            return res.send({Status:"User dosen't exists"})
            
        }
        const token = jwt.sign({id: user._id} , "jwt_secret_key", {expiresIn:"1d"});
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'priyanshioza2304@gmail.com',
              pass: 'ecrd rhva afpd wvyi'
            }
          });
          
          var mailOptions = {
            from: 'priyanshioza2304@gmail.com',
            to: 'priyanshioza2304@gmail.com',
            subject: 'Reset Password',
            text: `http://localhost:3000/reset-password/${user._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status:"success"})
            }
          });
    })


});

// RESET PASSWORD ENDPOINT
app.post('/reset-password/:id/:token' , (req,res) => {
    const {id,token} = req.params;
    const {password} = req.body;

    jwt.verify(token , "jwt_secret_key" , (err,decoded) => {
        if(err){
            return res.json({Status: "Error with token"});
        }
        else{
            bcrypt.hash(password , 10)
            .then(hash => {
                UserModel.findByIdAndUpdate({_id : id}, {password:hash}, { new: true })
                .then(u => res.send({Status:"success"}))
                .catch(err => res.send({Status:err}))
            })
        }
    })
});


// ADD DOCTOR APPOINTMENT
app.post('/admin/add', async (req, res) => {
  try {
    const { name, email, specialization, availability, contact } = req.body; // Destructure values from request body
    
    const doctor = new DoctorModel({ name, email, specialization, availability, contact });
    await doctor.save();
    return res.status(201).json({ success: true, message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error adding doctor:', error);
    return res.status(500).json({ success: false, message: 'Error adding doctor', error });
  }
});

// GET DOCTOR ENDPOINT

app.get('/doctors', async (req, res) => {
  try {
    const doctors = await DoctorModel.find();
    return res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// UPDATE DOCTOR ROUTE
app.put('/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, specialization, availability, contact } = req.body;

       // Log received data for debugging
    console.log("Received data:", req.body);
    console.log("Doctor ID:", id);

    // Find the doctor by ID and update the details
    const updatedDoctor = await DoctorModel.findByIdAndUpdate(id, {
      name,
      email,
      specialization,
      availability,
      contact
    }, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    return res.status(200).json({ success: true, message: 'Doctor details updated successfully' });
  } catch (error) {
    console.error('Error updating doctor:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



// BOOK APPOINTMENT

const appointmentSchema = new mongoose.Schema({
  patientName: String,
  patientEmail: String,
  doctorName: String,
  doctorEmail: String,
  selectedDate: Date, // Define selectedDate as Date type
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.post('/book-appointment', async (req, res) => {
  const { patientName, patientEmail, doctorName, doctorEmail, selectedDate } = req.body;

  // Check if selectedDate is a valid date string
  if (!Date.parse(selectedDate)) {
    return res.status(400).json({ error: 'Invalid date format for selectedDate' });
  }

  try {
    const newAppointment = new Appointment({
      patientName,
      patientEmail,
      doctorName,
      doctorEmail,
      selectedDate: new Date(selectedDate), // Convert date string to Date object
    });

    await newAppointment.save();

    console.log('Appointment saved successfully.');
    return res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }
});


 // FETCH APPOINTMENTS ENDPOINT
 app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});


// Define a mongoose schema for ServiceBooking
const serviceBookingSchema = new mongoose.Schema({
  patientName: String,
  patientEmail: String,
  serviceName: String,
  
});

// Define a mongoose model for ServiceBooking
const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);

// Route for booking a service
app.post('/api/book-service', async (req, res) => {
  try {
    const { patientName, patientEmail, serviceName } = req.body;
    console.log(req.body);


    // Check if required fields are provided
    if (!patientName || !patientEmail || !serviceName) {
      return res.status(400).json({ error: 'Please provide patientName, patientEmail, and serviceId' });
    }

    // Create a new ServiceBooking instance
    const booking = new ServiceBooking({
      patientName,
      patientEmail,
      serviceName
    });

    // Save the booking to the database
    await booking.save();

    // Respond with success message
    res.status(200).json({ message: 'Service booked successfully' });
  } catch (err) {
    console.error('Error booking service:', err);
    res.status(500).json({ error: 'Failed to book service. Please try again later.' });
  }
});










app.get('/admin/profile', async (req, res) => {
    try {
        const admin = await UserModel.findOne({ account: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: "Admin profile not found" });
        }
        return res.status(200).json({ admin });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});




app.get('/patient/profile', async (req, res) => {
  try {
       // Assuming you have middleware to extract user information from the token
      const patient = await UserModel.findOne({account:'patient' });
      console.log(patient);
      if (!patient) {
          return res.status(404).json({ message: "Patient profile not found" });
      }
      return res.status(200).json({ patient });
  } catch (error) {
      console.error("Error fetching patient profile:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/doctor/profile', async (req, res) => {
  try {
      const doctors = await UserModel.findOne({ account: 'doctor' });
      if (!doctors) {
          return res.status(404).json({ message: "No doctors found" });
      }
      return res.status(200).json({ doctors });
  } catch (error) {
      console.error("Error fetching doctor profiles:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});




  




app.get('/patients', async (req, res) => {
    try {
        const patients = await UserModel.find({ account: 'patient' }); // Fetch users with account type 'patient'
        return res.status(200).json({ patients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});





app.post('/save-appointments', async (req, res) => {
  try {
    const { patientName, patientEmail, doctorName, doctorEmail, date } = req.body;
    if (!patientName || !patientEmail || !doctorName || !doctorEmail || !date) {
      return res.status(400).json({ error: 'Patient name, patient email, doctor name, doctor email, and date are required.' });
    }
    // Create a new appointment instance
    const appointment = new AppointmentModel({ patientName, patientEmail, doctorName, doctorEmail, date });
    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ error: 'Failed to save appointment.' });
  }
});








  
  // Fetch doctor details by ID endpoint
  app.get('/doctors/:doctorId', async (req, res) => {
    try {
      const doctorId = req.params.doctorId;
      const doctor = await DoctorModel.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.status(200).json({ doctor });
    } catch (error) {
      console.error('Error fetching doctor:', error);
      res.status(500).json({ error: 'Failed to fetch doctor details' });
    }
  });


  
  // Fetch patient details endpoint
  app.get('/patients/:id', async (req, res) => {
    try {
      const patientId = req.params.id;
      const patient = await UserModel.findById(patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json({ patient });
    } catch (error) {
      console.error('Error fetching patient details:', error);
      res.status(500).json({ error: 'Failed to fetch patient details' });
    }
  });