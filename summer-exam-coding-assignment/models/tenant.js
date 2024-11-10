const mongoose = require('mongoose');



// Define the schema for core personal details
const tenantSchema = mongoose.Schema({
  
  title: { 
          type: String,
          enum: ['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Other'], 
          required: true
         },
  firstName:{ 
              type: String, 
              required: true 
            },
  surname: { 
             type: String,
             required: true 
            },
  phoneNumber: { 
                type: String, 
                required: true },
  emailAddress: { 
                  type: String,
                   required: true },
  
    addressLine1: { 
                    type: String, 
                    required: true 
                  },
    addressLine2: { 
                    type: String
                  },
    town: { 
            type: String, 
            required: true
          },
    countyCity: { 
                 type: String, 
                 required: true 
                },
    eircode: { type: String },
// Only required when title is "Other"
});

// Create a model using the schema
const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
