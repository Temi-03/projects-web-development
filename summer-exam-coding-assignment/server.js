const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Tenant = require('./models/tenant');
const Landlord = require('./models/landlord');
const Contract = require('./models/contract');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json())
//connecting to database
app.listen(3000, () => {
    console.log('Server started');
  });
  app.use(express.static('public'));
  
  app.get("/",function(req,res){
 res.sendFile(__dirname + "/public/web.html");//connecting thr file so im able  to use UI

    });

    mongoose.connect('mongodb+srv://temi:temi@cluster0.hibr47u.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true, // connecting to the local host ip is everywhere
        useUnifiedTopology: true 
    }).then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
    
    app.post("/landlord", async (req, res) => {
        try {
          // Convert checkbox values to boolean
          const permissionCouncil = req.body.permissionCouncil === 'on';
          const permissionContactEmail = req.body.permissionContactEmail === 'on'; //the boolean part
      
          // Create a new landlord y
          const newLandlord = await Landlord.create({
            title: req.body.title,
            firstName: req.body.firstName,
            surname: req.body.surname,
            phoneNumber: req.body.phoneNumber,
            emailAddress: req.body.emailAddress,
              addressLine1: req.body.addressLine1,
              addressLine2: req.body.addressLine2,
              town: req.body.town,
              countyCity: req.body.countyCity, //creating the schema
              eircode: req.body.eircode
            ,
            dateOfBirth: req.body.dateOfBirth,
            permissionCouncil,
            permissionContactEmail
          });
      
          // Redirect to the web.html page after successful schema
          res.redirect('/'); 
        } catch (error) {
          console.error('Error creating landlord:', error);
          res.status(400).json({ message: 'Error creating landlord', error: error.message });
        }
      });
      app.post("/tenant", async (req, res) => {
        try {
         
          // Create a new landlord based on request body
          const newTenant = await Tenant.create({
            title: req.body.title,
            firstName: req.body.firstName,
            surname: req.body.surname,
            phoneNumber: req.body.phoneNumber,
            emailAddress: req.body.emailAddress,
              addressLine1: req.body.addressLine1,
              addressLine2: req.body.addressLine2,
              town: req.body.town,
              countyCity: req.body.countyCity,
              eircode: req.body.eircode
            
          });
      
         
          res.redirect('/');
        } catch (error) {
          console.error('Error creating tenant:', error);
          res.status(400).json({ message: 'Error creating tenant', error: error.message });
        }
      });
      


      // GET endpoint to fetch landlords based on first name, surname, and phone number //so we can use it for fining the person and editing
app.get("/landlords", async (req, res) => {
    try {
      const { firstName, surname, phoneNumber } = req.query;
  
      // Check if all required parameters are there
      if (!firstName || !surname || !phoneNumber) {
        return res.status(400).json({ message: 'First name, surname, and phone number are required' });
      }
  
      //  find landlords by first name, surname, and phone number
      const landlord = await Landlord.findOne({ firstName, surname, phoneNumber });
  
      // Check if the landlord is found
      if (!landlord) {
        return res.status(404).json({ message: 'Landlord not found' });
      }
  
      res.status(200).json({ message: 'Landlord found', landlord });
    } catch (error) {
      console.error('Error fetching landlord:', error);
      res.status(500).json({ message: 'Error fetching landlord', error: error.message });
    }
  });
  app.get("/tenant", async (req, res) => {
    try {
      const { firstName, surname, phoneNumber } = req.query;
  
      // Check if all required parameters are there
      if (!firstName || !surname || !phoneNumber) {
        return res.status(400).json({ message: 'First name, surname, and phone number are required' });
      }
  
      // find landlords by first name, surname, and phone number
      const tenant = await Tenant.findOne({ firstName, surname, phoneNumber });
  
      // Check if the landlord is found
      if (!tenant) {
        return res.status(404).json({ message: 'tenant not found' });
      }
  
      res.status(200).json({ message: 'Tenant found', tenant });
    } catch (error) {
      console.error('Error fetching tenant:', error);
      res.status(500).json({ message: 'Error fetching tenant', error: error.message });
    }
  });

 

    // Find and delete the landlord
    app.post("/deltelandlord", async (req, res) => {
      const { firstName,surname,phoneNumber } = req.body;
      try {
        const deletedLandlord = await Landlord.deleteOne({ firstName: firstName,surname:surname,phoneNumber:phoneNumber });
        if (deletedLandlord.deletedCount === 0) {
          return res.status(404).json({ message: 'Landlord not found' });
        }
        res.json({ status: "okay", message: "Landlord deleted successfully" });
      } catch (error) {
        console.error('Error deleting landlord:', error);
        res.status(500).json({ message: 'Error deleting landlord', error: error.message });
      }
    });
    app.post("/deltetenant", async (req, res) => {
      const { firstName,surname,phoneNumber } = req.body;
      try {
        const deletedTenant= await Tenant.deleteOne({ firstName: firstName,surname:surname,phoneNumber:phoneNumber });
        if (deletedTenant.deletedCount === 0) {
          return res.status(404).json({ message: 'tenat not found' });
        }
        res.json({ status: "okay", message: "tenat deleted successfully" });
      } catch (error) {
        console.error('Error deleting tenant:', error);
        res.status(500).json({ message: 'Error deleting tenant', error: error.message });
      }
    });
    
    app.post("/editlandlord", async (req, res) => {
      const { firstName, surname, phoneNumber, emailAddress, addressLine1, addressLine2, town, countyCity, eircode } = req.body;
      try {
        const updatedLandlord = await Landlord.findOneAndUpdate(
          { firstName: firstName, surname: surname,phoneNumber: phoneNumber, },
          {
            $set: {
              
              email: emailAddress,
              addressLine: addressLine1,
              addressLine2: addressLine2,
              town: town,
              city: countyCity, 
              eircode: eircode
            }
          },
          { new: true }
        );
        if (!updatedLandlord) {
          return res.status(404).json({ message: 'Landlord not found' });
        }
        res.json({ status: "okay", message: "Landlord details updated successfully", updatedLandlord });
      } catch (error) {
        console.error('Error updating landlord:', error);
        res.status(500).json({ message: 'Error updating landlord', error: error.message });
      }
    });
    app.post("/edittenant", async (req, res) => {
      const { firstName, surname, phoneNumber, emailAddress, addressLine1, addressLine2, town, countyCity, eircode } = req.body;
      try {
        const updatedTenant = await Tenant.findOneAndUpdate(
          { firstName: firstName, surname: surname,phoneNumber: phoneNumber, },
          {
            $set: {
              
              email: emailAddress,
              addressLine: addressLine1,
              addressLine2: addressLine2,
              town: town,
              city: countyCity, 
              eircode: eircode
            }
          },
          { new: true }
        );
        if (!updatedTenant) {
          return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json({ status: "okay", message: "Tenant details updated successfully", updatedTenant});
      } catch (error) {
        console.error('Error updating Tenant:', error);
        res.status(500).json({ message: 'Error updating Tenant', error: error.message });
      }
    });
; 

app.post("/createcontract", async (req, res) => {
  const { contractDate, propertyAddress, tenant1, tenant2, tenant3, landlordName, feeMonthly, propertyDoorNumber, contractLength, propertyType } = req.body;
  try {
    // Check if the landlord exists
    const landlord = await Landlord.findOne({ firstName: landlordName });
    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found' });
    }

    // Check if tenant1 exists 
    const existingTenant1 = await Tenant.findOne({ firstName: tenant1 });
    if (!existingTenant1) {
      return res.status(404).json({ message: 'Tenant 1 not found' });
    }

    // Check if tenant2 exists (optional)
    let existingTenant2;
    if (tenant2) {
      existingTenant2 = await Tenant.findOne({ firstName: tenant2 });
      if (!existingTenant2) {
        return res.status(404).json({ message: 'Tenant 2 not found' });
      }
    }

    // Check if tenant3 exists (optional)
    let existingTenant3;
    if (tenant3) {
      existingTenant3 = await Tenant.findOne({ firstName: tenant3 });
      if (!existingTenant3) {
        return res.status(404).json({ message: 'Tenant 3 not found' });
      }
    }

    // Create a new contract
    const newContract = new Contract({
      contractDate,
      propertyAddress,
      tenant1: existingTenant1._id,
  tenant2: existingTenant2 ? existingTenant2._id : null,
  tenant3: existingTenant3 ? existingTenant3._id : null,
      landlord: landlord._id, 
      feeMonthly,
      propertyDoorNumber,
      contractLength,
      propertyType
    });

    // Save the contract
    await newContract.save();

    res.status(201).json({ status: "okay", message: "Contract created successfully", newContract });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ message: 'Error creating contract', error: error.message });
  }
});
app.get("/getcontract", async (req, res) => {
  const { doorNumber, propertyAddress } = req.query;

  try {
    // Create an array to store the populate options
    const populateOptions = [
      { path: 'landlord', select: 'firstName lastName' }, // Populate landlord details
      { path: 'tenant1', select: 'firstName lastName' }    // Always populate tenant1 details
    ];

    //  add populate options for tenant2 and tenant3 only if they have info
    if (req.query.tenant2) {
      populateOptions.push({ path: 'tenant2', select: 'firstName lastName' });
    }
    if (req.query.tenant3) {
      populateOptions.push({ path: 'tenant3', select: 'firstName lastName' });
    }

    // Find the contract based on door number and property address
    const contract = await Contract.findOne({ propertyDoorNumber: doorNumber, propertyAddress })
      .populate(populateOptions);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.json({ status: "okay", contract });
  } catch (error) {
    console.error('Error finding contract:', error);
    res.status(500).json({ message: 'Error finding contract', error: error.message });
  }
});

module.exports = app;


//data dump for landlords
/*const landlordData = [
  {
    title: 'Mr',
    firstName: 'John',
    surname: 'Doe',
    phoneNumber: '123-456-7890',
    emailAddress: 'john.doe@example.com',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 101',
    town: 'Anytown',
    countyCity: 'Countyshire',
    eircode: 'A1B 2C3',
    dateOfBirth: '1980-01-01',
    permissionCouncil: true,
    permissionContactEmail: true
  },
  {
    title: 'Ms',
    firstName: 'Alice',
    surname: 'Smith',
    phoneNumber: '987-654-3210',
    emailAddress: 'alice.smith@example.com',
    addressLine1: '456 Elm St',
    addressLine2: '',
    town: 'Sometown',
    countyCity: 'Cityville',
    eircode: 'X9Y 8Z7',
    dateOfBirth: '1990-05-15',
    permissionCouncil: true,
    permissionContactEmail: true
  },
  {
    title: 'Dr',
    firstName: 'Michael',
    surname: 'Johnson',
    phoneNumber: '555-123-4567',
    emailAddress: 'michael.johnson@example.com',
    addressLine1: '789 Pine St',
    addressLine2: 'Suite 200',
    town: 'Villageville',
    countyCity: 'Metro County',
    eircode: 'P0Q 1R2',
    dateOfBirth: '1975-11-30',
    permissionCouncil: true,
    permissionContactEmail: true
  },
  {
    title: 'Mrs',
    firstName: 'Emily',
    surname: 'Brown',
    phoneNumber: '333-555-7777',
    emailAddress: 'emily.brown@example.com',
    addressLine1: '101 Oak Ave',
    addressLine2: '',
    town: 'Greenville',
    countyCity: 'County City',
    eircode: 'E5F 6G7',
    dateOfBirth: '1982-08-20',
    permissionCouncil: true,
    permissionContactEmail: true
  },
  {
    title: 'Miss',
    firstName: 'Sophia',
    surname: 'Lee',
    phoneNumber: '111-222-3333',
    emailAddress: 'sophia.lee@example.com',
    addressLine1: '222 Maple Rd',
    addressLine2: 'Unit 10',
    town: 'Riverdale',
    countyCity: 'River County',
    eircode: 'M3N 4P5',
    dateOfBirth: '1995-04-10',
    permissionCouncil: true,
    permissionContactEmail: true
  },
  {
    title: 'Mr',
    firstName: 'Daniel',
    surname: 'Williams',
    phoneNumber: '444-777-9999',
    emailAddress: 'daniel.williams@example.com',
    addressLine1: '777 Cherry Lane',
    addressLine2: '',
    town: 'Hilltop',
    countyCity: 'Mountain County',
    eircode: 'S6T 8U9',
    dateOfBirth: '1988-12-15',
    permissionCouncil: true,
    permissionContactEmail: true
  }
];

module.exports = { landlordData };


// Insert data into MongoDB using Mongoose
Landlord.insertMany(landlordData)
  .then((landlords) => {
    console.log('Landlords inserted successfully:', landlords);
    mongoose.connection.close(); // Close the connection after inserting data
  })
  .catch((error) => {
    console.error('Error inserting landlords:', error);
    mongoose.connection.close(); // Close the connection on error too
  });*/
  // data dump for tenants 
  /*const tenantData = [
    {
      title: 'Mr',
      firstName: 'James',
      surname: 'Smith',
      phoneNumber: '111-222-3333',
      emailAddress: 'james.smith@example.com',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 101',
      town: 'Anytown',
      countyCity: 'Countyshire',
      eircode: 'A1B 2C3',
      dateOfBirth: '1985-03-12'
    },
    {
      title: 'Ms',
      firstName: 'Emma',
      surname: 'Johnson',
      phoneNumber: '222-333-4444',
      emailAddress: 'emma.johnson@example.com',
      addressLine1: '456 Elm St',
      addressLine2: '',
      town: 'Sometown',
      countyCity: 'Cityville',
      eircode: 'X9Y 8Z7',
      dateOfBirth: '1992-07-20'
    },
    {
      title: 'Mrs',
      firstName: 'Olivia',
      surname: 'Williams',
      phoneNumber: '333-444-5555',
      emailAddress: 'olivia.williams@example.com',
      addressLine1: '789 Pine St',
      addressLine2: 'Suite 200',
      town: 'Villageville',
      countyCity: 'Metro County',
      eircode: 'P0Q 1R2',
      dateOfBirth: '1980-12-05'
    },
    {
      title: 'Miss',
      firstName: 'Sophia',
      surname: 'Brown',
      phoneNumber: '444-555-6666',
      emailAddress: 'sophia.brown@example.com',
      addressLine1: '101 Oak Ave',
      addressLine2: '',
      town: 'Greenville',
      countyCity: 'County City',
      eircode: 'E5F 6G7',
      dateOfBirth: '1998-04-30'
    },
    {
      title: 'Mr',
      firstName: 'Liam',
      surname: 'Jones',
      phoneNumber: '555-666-7777',
      emailAddress: 'liam.jones@example.com',
      addressLine1: '222 Maple Rd',
      addressLine2: 'Unit 10',
      town: 'Riverdale',
      countyCity: 'River County',
      eircode: 'M3N 4P5',
      dateOfBirth: '1990-11-15'
    },
    {
      title: 'Ms',
      firstName: 'Amelia',
      surname: 'Garcia',
      phoneNumber: '666-777-8888',
      emailAddress: 'amelia.garcia@example.com',
      addressLine1: '777 Cherry Lane',
      addressLine2: '',
      town: 'Hilltop',
      countyCity: 'Mountain County',
      eircode: 'S6T 8U9',
      dateOfBirth: '1987-06-25'
    },
    {
      title: 'Mr',
      firstName: 'Benjamin',
      surname: 'Martinez',
      phoneNumber: '777-888-9999',
      emailAddress: 'benjamin.martinez@example.com',
      addressLine1: '888 Cedar Ave',
      addressLine2: 'Unit 5',
      town: 'Woodsville',
      countyCity: 'Forest County',
      eircode: 'R4W 5T6',
      dateOfBirth: '1995-09-18'
    },
    {
      title: 'Ms',
      firstName: 'Evelyn',
      surname: 'Hernandez',
      phoneNumber: '888-999-0000',
      emailAddress: 'evelyn.hernandez@example.com',
      addressLine1: '999 Pine Lane',
      addressLine2: '',
      town: 'Lakeview',
      countyCity: 'Lake County',
      eircode: 'V7X 8Y9',
      dateOfBirth: '1993-02-07'
    },
    {
      title: 'Miss',
      firstName: 'Mia',
      surname: 'Lopez',
      phoneNumber: '999-000-1111',
      emailAddress: 'mia.lopez@example.com',
      addressLine1: '111 Oakwood Dr',
      addressLine2: '',
      town: 'Valleytown',
      countyCity: 'Valley County',
      eircode: 'T2U 3V4',
      dateOfBirth: '1997-10-12'
    },
    {
      title: 'Mr',
      firstName: 'William',
      surname: 'Rodriguez',
      phoneNumber: '123-456-7890',
      emailAddress: 'william.rodriguez@example.com',
      addressLine1: '234 Elm St',
      addressLine2: '',
      town: 'Springfield',
      countyCity: 'Springfield County',
      eircode: 'Q1R 2S3',
      dateOfBirth: '1983-08-22'
    }
  ];
  Tenant.insertMany(tenantData)
  .then((tenants) => {
    console.log('Tenants inserted successfully:', tenants);
    mongoose.connection.close(); // Close the connection after inserting data
  })
  .catch((error) => {
    console.error('Error inserting tenants:', error);
    mongoose.connection.close(); // Close the connection on error too
  });*/
 
  
  
  //_id
  //data dump contraxts
/*664049eabacd3309dc0cc2a4
title
"Mr"
firstName
"John"
surname
"Doe"
phoneNumber
"123-456-7890"
emailAddress
"john.doe@example.com"
addressLine1
"123 Main St"
addressLine2
"Apt 101"
town
"Anytown"
countyCity
"Countyshire"
eircode
"A1B 2C3"
dateOfBirth
1980-01-01T00:00:00.000+00:00
permissionCouncil
true
permissionContactEmail
true
__v
0
_id
664049eabacd3309dc0cc2a5
title
"Ms"
firstName
"Alice"
surname
"Smith"
phoneNumber
"987-654-3210"
emailAddress
"alice.smith@example.com"
addressLine1
"456 Elm St"
addressLine2
""
town
"Sometown"
countyCity
"Cityville"
eircode
"X9Y 8Z7"
dateOfBirth
1990-05-15T00:00:00.000+00:00
permissionCouncil
true
permissionContactEmail
true
__v
0
_id
664049eabacd3309dc0cc2a6
title
"Dr"
firstName
"Michael"
surname
"Johnson"
phoneNumber
"555-123-4567"
emailAddress
"michael.johnson@example.com"
addressLine1
"789 Pine St"
addressLine2
"Suite 200"
town
"Villageville"
countyCity
"Metro County"
eircode
"P0Q 1R2"
dateOfBirth
1975-11-30T00:00:00.000+00:00
permissionCouncil
true
permissionContactEmail
true
__v
0
_id
664049eabacd3309dc0cc2a7
title
"Mrs"
firstName
"Emily"
surname
"Brown"
phoneNumber
"333-555-7777"
emailAddress
"emily.brown@example.com"
addressLine1
"101 Oak Ave"
addressLine2
""
town
"Greenville"
countyCity
"County City"
eircode
"E5F 6G7"
dateOfBirth
1982-08-20T00:00:00.000+00:00
permissionCouncil
true
permissionContactEmail
true
__v
0
_id
664049eabacd3309dc0cc2a8
title
"Miss"
firstName
"Sophia"
surname
"Lee"
phoneNumber
"111-222-3333"
emailAddress
"sophia.lee@example.com"
addressLine1
"222 Maple Rd"
addressLine2
"Unit 10"
town
"Riverdale"
countyCity
"River County"
eircode
"M3N 4P5"
dateOfBirth
1995-04-10T00:00:00.000+00:00
permissionCouncil
true
permissionContactEmail
true
__v
0
_id
664049eabacd3309dc0cc2a9
title
"Mr"
firstName
"Daniel"
surname
"Williams"
phoneNumber
"444-777-9999"
emailAddress
"daniel.williams@example.com"
addressLine1
"777 Cherry Lane"
addressLine2
""
town
"Hilltop"
countyCity
"Mountain County"
eircode
"S6T 8U9"
dateOfBirth
1988-12-15T00:00:00.000+00:00
permissionCouncil
true
permissionContactEmail
true
__v
0*/
  
 //i used w3schools 
 //the debug arena on youtube 
 //and Devatmin on yotube as my resouces to put this together 