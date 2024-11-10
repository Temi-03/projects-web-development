const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//created the schrame that connects the tenant and the landlord to the contract
const contractSchema = new Schema({
  contractDate: { type: Date, required: true },
  propertyAddress: { type: String, required: true },
  tenant1: { type: Schema.Types.ObjectId, ref: 'Tenant',required: true },
  tenant2: { type: Schema.Types.ObjectId, ref: 'Tenant' },
  tenant3: { type: Schema.Types.ObjectId, ref: 'Tenant'},
  landlord: { type: Schema.Types.ObjectId, ref: 'Landlord', required: true },
  feeMonthly: { type: Number, required: true },
  propertyDoorNumber: { type: String },
  contractLength: { type: String, enum: ['Month', 'Year', 'Permanent'], required: true },
  propertyType: { type: String, enum: ['Apartment', 'Semi-Detached', 'Detached', 'Other'], required: true }
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
