
const { pool } = require('../Database/database');

// Create a new fare negotiation request
const createNegotiation = async (req, res) => {
  try {
    const {
      rideId,
      userId,
      userOffer
    } = req.body;
    
    // Check if ride exists
    const [rides] = await pool.query('SELECT * FROM rides WHERE id = ?', [rideId]);
    
    if (rides.length === 0) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Set expiration time (30 minutes from now)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60000);
    
    // Create negotiation
    const [result] = await pool.query(
      `INSERT INTO fare_negotiations (
        rideId, userId, userOffer, status, createdAt, updatedAt, expiresAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [rideId, userId, userOffer, 'pending', now, now, expiresAt]
    );
    
    // Update ride to mark it as negotiable
    await pool.query(
      'UPDATE rides SET isNegotiable = TRUE, suggestedFare = ? WHERE id = ?',
      [userOffer, rideId]
    );
    
    return res.status(201).json({
      success: true,
      message: 'Fare negotiation created successfully',
      data: {
        id: result.insertId,
        rideId,
        userId,
        userOffer,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        expiresAt
      }
    });
  } catch (error) {
    console.error('Error creating negotiation:', error);
    return res.status(500).json({ success: false, message: 'Failed to create negotiation' });
  }
};

// Get all negotiations for a ride
const getRideNegotiations = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    // Get negotiations
    const [negotiations] = await pool.query(
      'SELECT * FROM fare_negotiations WHERE rideId = ? ORDER BY createdAt DESC',
      [rideId]
    );
    
    return res.status(200).json({ success: true, data: negotiations });
  } catch (error) {
    console.error('Error fetching negotiations:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch negotiations' });
  }
};

// Respond to negotiation (driver)
const respondToNegotiation = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId, status, driverCounterOffer } = req.body;
    
    // Check if negotiation exists
    const [negotiations] = await pool.query('SELECT * FROM fare_negotiations WHERE id = ?', [id]);
    
    if (negotiations.length === 0) {
      return res.status(404).json({ success: false, message: 'Negotiation not found' });
    }
    
    const negotiation = negotiations[0];
    
    // Validate status
    if (!['accepted', 'rejected', 'countered'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    // Update negotiation
    const now = new Date();
    const updateFields = ['status = ?', 'driverId = ?', 'updatedAt = ?'];
    const updateValues = [status, driverId, now];
    
    if (status === 'countered' && driverCounterOffer) {
      updateFields.push('driverCounterOffer = ?');
      updateValues.push(driverCounterOffer);
    }
    
    await pool.query(
      `UPDATE fare_negotiations SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, id]
    );
    
    // If accepted, update the ride with the new fare and driver
    if (status === 'accepted') {
      const newFare = negotiation.userOffer;
      await pool.query(
        'UPDATE rides SET fare = ?, driverId = ? WHERE id = ?',
        [newFare, driverId, negotiation.rideId]
      );
    } else if (status === 'countered' && driverCounterOffer) {
      // If countered, update the ride's suggestedFare
      await pool.query(
        'UPDATE rides SET suggestedFare = ? WHERE id = ?',
        [driverCounterOffer, negotiation.rideId]
      );
    }
    
    return res.status(200).json({
      success: true,
      message: `Negotiation ${status} successfully`,
      data: {
        id: parseInt(id),
        status,
        driverId,
        ...(status === 'countered' && { driverCounterOffer }),
        updatedAt: now
      }
    });
  } catch (error) {
    console.error('Error responding to negotiation:', error);
    return res.status(500).json({ success: false, message: 'Failed to respond to negotiation' });
  }
};

// Accept counter offer (user)
const acceptCounterOffer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if negotiation exists and is countered
    const [negotiations] = await pool.query(
      'SELECT * FROM fare_negotiations WHERE id = ? AND status = ?',
      [id, 'countered']
    );
    
    if (negotiations.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Negotiation not found or not in countered state' 
      });
    }
    
    const negotiation = negotiations[0];
    
    // Update negotiation
    const now = new Date();
    await pool.query(
      'UPDATE fare_negotiations SET status = ?, updatedAt = ? WHERE id = ?',
      ['accepted', now, id]
    );
    
    // Update the ride with the counter offer fare and driver
    await pool.query(
      'UPDATE rides SET fare = ?, driverId = ? WHERE id = ?',
      [negotiation.driverCounterOffer, negotiation.driverId, negotiation.rideId]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Counter offer accepted successfully',
      data: {
        id: parseInt(id),
        status: 'accepted',
        fare: negotiation.driverCounterOffer,
        updatedAt: now
      }
    });
  } catch (error) {
    console.error('Error accepting counter offer:', error);
    return res.status(500).json({ success: false, message: 'Failed to accept counter offer' });
  }
};

module.exports = {
  createNegotiation,
  getRideNegotiations,
  respondToNegotiation,
  acceptCounterOffer
};
