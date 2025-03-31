
const { pool } = require('../Database/database');

// Book a new ride
const bookRide = async (req, res) => {
  try {
    const {
      userId,
      startAddress,
      startLat,
      startLng,
      endAddress,
      endLat,
      endLng,
      fare,
      distance,
      duration,
      paymentMethod,
      rideType,
      isShared,
      rideMood
    } = req.body;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Calculate estimated arrival
    const now = new Date();
    const estimatedArrival = new Date(now.getTime() + 5 * 60000); // 5 minutes from now
    
    // Book ride
    const [result] = await pool.query(
      `INSERT INTO rides (
        userId, startAddress, startLat, startLng, endAddress, endLat, endLng,
        status, fare, distance, duration, createdAt, updatedAt,
        paymentMethod, rideType, isShared, rideMood, estimatedArrival
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, startAddress, startLat, startLng, endAddress, endLat, endLng,
        'pending', fare, distance, duration, now, now,
        paymentMethod, rideType, isShared, rideMood, estimatedArrival
      ]
    );
    
    return res.status(201).json({
      success: true,
      message: 'Ride booked successfully',
      data: {
        id: result.insertId,
        userId,
        startAddress,
        startLat,
        startLng,
        endAddress,
        endLat,
        endLng,
        status: 'pending',
        fare,
        distance,
        duration,
        paymentMethod,
        rideType,
        isShared,
        rideMood,
        estimatedArrival,
        createdAt: now,
        updatedAt: now
      }
    });
  } catch (error) {
    console.error('Error booking ride:', error);
    return res.status(500).json({ success: false, message: 'Failed to book ride' });
  }
};

// Get a ride by ID
const getRideById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get ride details
    const [rides] = await pool.query('SELECT * FROM rides WHERE id = ?', [id]);
    
    if (rides.length === 0) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Get ride stops if any
    const [stops] = await pool.query('SELECT * FROM ride_stops WHERE rideId = ? ORDER BY position ASC', [id]);
    
    const ride = {
      ...rides[0],
      stops: stops
    };
    
    return res.status(200).json({ success: true, data: ride });
  } catch (error) {
    console.error('Error fetching ride:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch ride' });
  }
};

// Get all rides for a user
const getUserRides = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get rides
    const [rides] = await pool.query('SELECT * FROM rides WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    
    return res.status(200).json({ success: true, data: rides });
  } catch (error) {
    console.error('Error fetching user rides:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch rides' });
  }
};

// Update ride status
const updateRideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, driverId } = req.body;
    
    // Check if ride exists
    const [rides] = await pool.query('SELECT * FROM rides WHERE id = ?', [id]);
    
    if (rides.length === 0) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Update ride
    const now = new Date();
    const updateFields = ['status = ?', 'updatedAt = ?'];
    const updateValues = [status, now];
    
    if (driverId) {
      updateFields.push('driverId = ?');
      updateValues.push(driverId);
    }
    
    await pool.query(
      `UPDATE rides SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Ride status updated successfully',
      data: {
        id: parseInt(id),
        status,
        updatedAt: now,
        ...(driverId && { driverId })
      }
    });
  } catch (error) {
    console.error('Error updating ride status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update ride status' });
  }
};

// Rate a ride
const rateRide = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, isDriver } = req.body;
    
    // Check if ride exists
    const [rides] = await pool.query('SELECT * FROM rides WHERE id = ?', [id]);
    
    if (rides.length === 0) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Update rating
    const now = new Date();
    const ratingField = isDriver ? 'driverRating' : 'userRating';
    
    await pool.query(
      `UPDATE rides SET ${ratingField} = ?, updatedAt = ? WHERE id = ?`,
      [rating, now, id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Ride rated successfully',
      data: {
        id: parseInt(id),
        [ratingField]: rating,
        updatedAt: now
      }
    });
  } catch (error) {
    console.error('Error rating ride:', error);
    return res.status(500).json({ success: false, message: 'Failed to rate ride' });
  }
};

// Cancel a ride
const cancelRide = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ride exists
    const [rides] = await pool.query('SELECT * FROM rides WHERE id = ?', [id]);
    
    if (rides.length === 0) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    const ride = rides[0];
    
    // Can only cancel if ride is not already completed or cancelled
    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({ success: false, message: `Cannot cancel ride in ${ride.status} status` });
    }
    
    // Update ride
    const now = new Date();
    await pool.query(
      'UPDATE rides SET status = ?, updatedAt = ? WHERE id = ?',
      ['cancelled', now, id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully',
      data: {
        id: parseInt(id),
        status: 'cancelled',
        updatedAt: now
      }
    });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    return res.status(500).json({ success: false, message: 'Failed to cancel ride' });
  }
};

// Apply ridesharing discount
const applyRidesharingDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount } = req.body;
    
    // Check if ride exists
    const [rides] = await pool.query('SELECT * FROM rides WHERE id = ?', [id]);
    
    if (rides.length === 0) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    const ride = rides[0];
    
    // Only apply discount to shared rides
    if (!ride.isShared) {
      return res.status(400).json({ success: false, message: 'Cannot apply discount to non-shared ride' });
    }
    
    // Calculate new fare
    const oldFare = parseFloat(ride.fare);
    const discountAmount = parseFloat(discount);
    const newFare = oldFare * (1 - discountAmount / 100);
    
    // Update ride
    const now = new Date();
    await pool.query(
      'UPDATE rides SET fare = ?, appliedDiscount = ?, updatedAt = ? WHERE id = ?',
      [newFare, discountAmount, now, id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Ridesharing discount applied successfully',
      data: {
        id: parseInt(id),
        oldFare,
        newFare,
        appliedDiscount: discountAmount,
        updatedAt: now
      }
    });
  } catch (error) {
    console.error('Error applying ridesharing discount:', error);
    return res.status(500).json({ success: false, message: 'Failed to apply ridesharing discount' });
  }
};

// Add a stop to a ride
const addStopToRide = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, lat, lng, position } = req.body;
    
    // Check if ride exists
    const [rides] = await pool.query('SELECT * FROM rides WHERE id = ?', [id]);
    
    if (rides.length === 0) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Add stop
    const [result] = await pool.query(
      'INSERT INTO ride_stops (rideId, address, lat, lng, isCompleted, position) VALUES (?, ?, ?, ?, ?, ?)',
      [id, address, lat, lng, false, position]
    );
    
    // Update ride duration and distance
    const now = new Date();
    await pool.query(
      'UPDATE rides SET duration = duration + ?, distance = distance + ?, updatedAt = ? WHERE id = ?',
      [300, 1.5, now, id] // Assuming 5 more minutes and 1.5 more miles
    );
    
    return res.status(201).json({
      success: true,
      message: 'Stop added to ride successfully',
      data: {
        id: result.insertId,
        rideId: parseInt(id),
        address,
        lat,
        lng,
        isCompleted: false,
        position
      }
    });
  } catch (error) {
    console.error('Error adding stop to ride:', error);
    return res.status(500).json({ success: false, message: 'Failed to add stop to ride' });
  }
};

// Change ride destination
const changeRideDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { endAddress, endLat, endLng } = req.body;
    
    // Check if ride exists
    const [rides] = await pool.query('SELECT * FROM rides WHERE id = ?', [id]);
    
    if (rides.length === 0) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Update ride destination
    const now = new Date();
    await pool.query(
      'UPDATE rides SET endAddress = ?, endLat = ?, endLng = ?, updatedAt = ? WHERE id = ?',
      [endAddress, endLat, endLng, now, id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Ride destination changed successfully',
      data: {
        id: parseInt(id),
        endAddress,
        endLat,
        endLng,
        updatedAt: now
      }
    });
  } catch (error) {
    console.error('Error changing ride destination:', error);
    return res.status(500).json({ success: false, message: 'Failed to change ride destination' });
  }
};

// Generate split payment link
const generateSplitPaymentLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { emails } = req.body;
    
    // Check if ride exists
    const [rides] = await pool.query('SELECT * FROM rides WHERE id = ?', [id]);
    
    if (rides.length === 0) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    // Generate a link (in a real app, would create a unique token and save to database)
    const splitPaymentLink = `https://gocabs.com/split-payment/${id}/${Date.now()}`;
    
    // Update ride with split payment link
    const now = new Date();
    await pool.query(
      'UPDATE rides SET splitPaymentLink = ?, updatedAt = ? WHERE id = ?',
      [splitPaymentLink, now, id]
    );
    
    // In a real app, would send emails to all participants
    
    return res.status(200).json({
      success: true,
      message: 'Split payment link generated successfully',
      data: {
        id: parseInt(id),
        splitPaymentLink,
        emails,
        updatedAt: now
      }
    });
  } catch (error) {
    console.error('Error generating split payment link:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate split payment link' });
  }
};

module.exports = {
  bookRide,
  getRideById,
  getUserRides,
  updateRideStatus,
  rateRide,
  cancelRide,
  applyRidesharingDiscount,
  addStopToRide,
  changeRideDestination,
  generateSplitPaymentLink
};
