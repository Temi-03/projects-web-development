const express = require('express');
const router = express.Router();

// DELETE route for deleting a landlord
router.delete('/:firstname/:surname/:phoneNumber', async (req, res) => {
  try {
    const { firstname, surname, phoneNumber } = req.params;

    // Perform deletion logic here
    // Example: Delete landlord with the provided parameters

    res.status(200).json({ message: 'Landlord deleted successfully' });
  } catch (error) {
    console.error('Error deleting landlord:', error);
    res.status(500).json({ message: 'Error deleting landlord', error: error.message });
  }
});

module.exports = router;