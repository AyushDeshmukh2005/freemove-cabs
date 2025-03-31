
const { pool } = require('../Database/database');

// Create a new fare negotiation
const createNegotiation = async (req, res) => {
  try {
    const { rideId, userId, userOffer } = req.body;
    
    if (!rideId || !userId || !userOffer) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    
    // Set expiration time (e.g., 10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    const [result] = await pool.query(
      `INSERT INTO fare_negotiations 
       (rideId, userId, userOffer, status, createdAt, updatedAt, expiresAt) 
       VALUES (?, ?, ?, 'pending', NOW(), NOW(), ?)`,
      [rideId, userId, userOffer, expiresAt]
    );
    
    const negotiationId = result.insertId;
    
    // Update the ride to mark it as negotiable
    await pool.query(
      `UPDATE rides SET isNegotiable = true, suggestedFare = ? WHERE id = ?`,
      [userOffer, rideId]
    );
    
    return res.status(201).json({ 
      id: negotiationId,
      message: 'Fare negotiation created successfully',
      expiresAt
    });
  } catch (error) {
    console.error('Error creating negotiation:', error);
    return res.status(500).json({ error: 'Failed to create negotiation' });
  }
};

// Get all negotiations for a ride
const getRideNegotiations = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    const [negotiations] = await pool.query(
      `SELECT * FROM fare_negotiations WHERE rideId = ? ORDER BY createdAt DESC`,
      [rideId]
    );
    
    return res.status(200).json(negotiations);
  } catch (error) {
    console.error('Error fetching negotiations:', error);
    return res.status(500).json({ error: 'Failed to fetch negotiations' });
  }
};

// Driver responds to a negotiation (accept, reject or counter)
const respondToNegotiation = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId, response, counterOffer } = req.body;
    
    if (!driverId || !response) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    
    if (response === 'countered' && !counterOffer) {
      return res.status(400).json({ error: 'Counter offer is required' });
    }
    
    // Update the negotiation
    await pool.query(
      `UPDATE fare_negotiations SET 
       driverId = ?, 
       status = ?, 
       driverCounterOffer = ?, 
       updatedAt = NOW() 
       WHERE id = ?`,
      [driverId, response, counterOffer || null, id]
    );
    
    // If accepted, update the ride fare
    if (response === 'accepted') {
      const [negotiation] = await pool.query('SELECT * FROM fare_negotiations WHERE id = ?', [id]);
      if (negotiation.length > 0) {
        await pool.query(
          'UPDATE rides SET fare = ? WHERE id = ?',
          [negotiation[0].userOffer, negotiation[0].rideId]
        );
      }
    }
    
    return res.status(200).json({ 
      message: `Negotiation ${response} successfully`,
      counterOffer: response === 'countered' ? counterOffer : null
    });
  } catch (error) {
    console.error('Error responding to negotiation:', error);
    return res.status(500).json({ error: 'Failed to respond to negotiation' });
  }
};

// User accepts a counter offer from driver
const acceptCounterOffer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the negotiation details
    const [negotiations] = await pool.query('SELECT * FROM fare_negotiations WHERE id = ?', [id]);
    
    if (negotiations.length === 0) {
      return res.status(404).json({ error: 'Negotiation not found' });
    }
    
    const negotiation = negotiations[0];
    
    if (negotiation.status !== 'countered') {
      return res.status(400).json({ error: 'This negotiation does not have a counter offer to accept' });
    }
    
    // Update the negotiation status
    await pool.query(
      'UPDATE fare_negotiations SET status = "accepted", updatedAt = NOW() WHERE id = ?',
      [id]
    );
    
    // Update the ride fare with the counter offer
    await pool.query(
      'UPDATE rides SET fare = ? WHERE id = ?',
      [negotiation.driverCounterOffer, negotiation.rideId]
    );
    
    return res.status(200).json({ message: 'Counter offer accepted successfully' });
  } catch (error) {
    console.error('Error accepting counter offer:', error);
    return res.status(500).json({ error: 'Failed to accept counter offer' });
  }
};

module.exports = {
  createNegotiation,
  getRideNegotiations,
  respondToNegotiation,
  acceptCounterOffer
};
