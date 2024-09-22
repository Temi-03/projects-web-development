const mongoose = require('mongoose');
//landlord part of schema


const landlordSchema = mongoose.Schema ({
    
  title: { type: String, enum: ['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Other'], required: true },
  
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    town: { type: String, required: true },
    countyCity: { type: String, required: true },
    eircode: { type: String,required:false }
    ,
  dateOfBirth: { type: Date, required: true },
  permissionCouncil: { type: Boolean, required: true },
  permissionContactEmail: { type: Boolean, required: true }
});
const Landlord = mongoose.model('Landlord', landlordSchema);
    
    module.exports = Landlord;