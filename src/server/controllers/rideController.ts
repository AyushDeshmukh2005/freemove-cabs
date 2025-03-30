
import { Request, Response } from 'express';
import { pool } from '../../config/database';
import axios from 'axios';

// Book a new ride
export const bookRide = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      startLocation,
      endLocation,
      rideType = 'standard',
      paymentMethod = 'cash',
      stops,
      rideMood,
      nearbyLandmark,
      favoritedDriverId
    } = req.body;
    
    // Get current weather for the startLocation
    const weatherResponse = await axios.get(`http://localhost:5000/api/weather/current/${encodeURIComponent(startLocation.address)}`);
    const weatherCondition = weatherResponse.data.condition;
    
    // Calculate route details (in a real app, this would call a maps API)
    const distance = Math.floor(Math.random() * 20) + 5; // 5-25 km
    const duration = distance * 3; // 3 minutes per km
    
    // Get weather adjustment
    const adjustmentResponse = await axios.get(`http://localhost:5000/api/weather/adjustment/${weatherCondition}`);
    const weatherAdjustment = adjustmentResponse.data.adjustment;
    
    // Calculate fare based on distance, duration, and ride type
    const baseRate = rideType === 'premium' ? 3 : rideType === 'eco' ? 1.5 : 2;
    const distanceRate = rideType === 'premium' ? 2 : rideType === 'eco' ? 1 : 1.5;
    const durationRate = rideType === 'premium' ? 0.5 : rideType === 'eco' ? 0.2 : 0.3;
    
    let fare = baseRate + (distance * distanceRate) + (duration * durationRate);
    
    // Apply eco discount (additional 10% off for eco rides)
    if (rideType === 'eco') {
      fare = fare * 0.9;
    }
    
    // Apply weather adjustments
    fare = fare * (1 + weatherAdjustment);
    fare = parseFloat(fare.toFixed(2));
    
    // Generate estimated arrival time (5-15 minutes from now)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5 + Math.floor(Math.random() * 10));
    const estimatedArrival = now.toISOString();
    
    // Generate split payment link
    const splitPaymentLink = `https://gocabs.app/split/${Math.random().toString(36).substring(2, 15)}`;
    
    // Start a database transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert ride into database
      const [result] = await connection.execute(
        `INSERT INTO rides (
          userId, startAddress, startLat, startLng, endAddress, endLat, endLng,
          status, fare, distance, duration, createdAt, updatedAt, paymentMethod,
          rideType, estimatedArrival, rideMood, weatherAdjustment, splitPaymentLink, nearbyLandmark
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          startLocation.address,
          startLocation.lat,
          startLocation.lng,
          endLocation.address,
          endLocation.lat,
          endLocation.lng,
          'pending',
          fare,
          distance,
          duration,
          paymentMethod,
          rideType,
          estimatedArrival,
          rideMood || null,
          weatherAdjustment,
          splitPaymentLink,
          nearbyLandmark || null
        ]
      );
      
      const rideId = (result as any).insertId;
      
      // Insert stops if provided
      if (stops && stops.length > 0) {
        for (let i = 0; i < stops.length; i++) {
          await connection.execute(
            `INSERT INTO ride_stops (rideId, address, lat, lng, isCompleted, position)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
              rideId,
              stops[i].address,
              stops[i].lat || 0,
              stops[i].lng || 0,
              false,
              i
            ]
          );
        }
      }
      
      // Commit transaction
      await connection.commit();
      
      // Get the full ride object to return
      const [rows] = await connection.execute(
        `SELECT * FROM rides WHERE id = ?`,
        [rideId]
      );
      
      // Get stops for the ride
      const [stopsRows] = await connection.execute(
        `SELECT * FROM ride_stops WHERE rideId = ? ORDER BY position ASC`,
        [rideId]
      );
      
      const ride = {
        ...(rows as any)[0],
        stops: stopsRows
      };
      
      // Simulate driver assignment after a short delay
      setTimeout(async () => {
        try {
          // Check if a favorited driver was requested
          let driverId;
          if (favoritedDriverId) {
            // In a real app, you would check if the driver is available
            // For demo, we'll use a 50% chance
            if (Math.random() > 0.5) {
              driverId = favoritedDriverId;
            } else {
              driverId = Math.random().toString(36).substring(2, 10);
            }
          } else {
            driverId = Math.random().toString(36).substring(2, 10);
          }
          
          // Update ride with driver
          await pool.execute(
            `UPDATE rides SET status = 'accepted', driverId = ?, updatedAt = NOW() WHERE id = ?`,
            ['accepted', driverId, rideId]
          );
          
          // In a real app, you would send a notification to the user here
          console.log(`Driver ${driverId} assigned to ride ${rideId}`);
        } catch (error) {
          console.error('Error assigning driver:', error);
        }
      }, 5000);
      
      res.status(201).json({ ride });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error booking ride:', error);
    res.status(500).json({ error: 'Failed to book ride' });
  }
};

// Get a specific ride by ID
export const getRideById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get ride from database
    const [rows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    if ((rows as any).length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    // Get stops for the ride
    const [stopsRows] = await pool.execute(
      `SELECT * FROM ride_stops WHERE rideId = ? ORDER BY position ASC`,
      [id]
    );
    
    const ride = {
      ...(rows as any)[0],
      stops: stopsRows
    };
    
    res.json({ ride });
  } catch (error) {
    console.error('Error getting ride:', error);
    res.status(500).json({ error: 'Failed to get ride' });
  }
};

// Get all rides for a user
export const getUserRides = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Get rides from database
    const [rows] = await pool.execute(
      `SELECT * FROM rides WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );
    
    // Get stops for each ride
    const rides = [];
    
    for (const ride of rows as any) {
      const [stopsRows] = await pool.execute(
        `SELECT * FROM ride_stops WHERE rideId = ? ORDER BY position ASC`,
        [ride.id]
      );
      
      rides.push({
        ...ride,
        stops: stopsRows
      });
    }
    
    res.json({ rides });
  } catch (error) {
    console.error('Error getting user rides:', error);
    res.status(500).json({ error: 'Failed to get user rides' });
  }
};

// Update ride status
export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Update ride status in database
    const [result] = await pool.execute(
      `UPDATE rides SET status = ?, updatedAt = NOW() WHERE id = ?`,
      [status, id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    // If ride completed, award driver points (in a real app)
    if (status === 'completed') {
      const [rows] = await pool.execute(
        `SELECT driverId, rideType, driverRating, distance FROM rides WHERE id = ?`,
        [id]
      );
      
      if ((rows as any).length > 0) {
        const ride = (rows as any)[0];
        
        if (ride.driverId) {
          // In a real app, you would call a service to award points
          // For demo purposes, we'll just log it
          console.log(`Driver ${ride.driverId} awarded points for ride ${id}`);
        }
      }
    }
    
    // Get updated ride
    const [rows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    res.json({ ride: (rows as any)[0] });
  } catch (error) {
    console.error('Error updating ride status:', error);
    res.status(500).json({ error: 'Failed to update ride status' });
  }
};

// Rate a ride
export const rateRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, isDriver } = req.body;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Update rating in database
    let updateField = isDriver ? 'userRating' : 'driverRating';
    
    const [result] = await pool.execute(
      `UPDATE rides SET ${updateField} = ?, updatedAt = NOW() WHERE id = ?`,
      [rating, id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    // Get updated ride
    const [rows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    res.json({ ride: (rows as any)[0] });
  } catch (error) {
    console.error('Error rating ride:', error);
    res.status(500).json({ error: 'Failed to rate ride' });
  }
};

// Cancel a ride
export const cancelRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get the current ride status
    const [rows] = await pool.execute(
      `SELECT status FROM rides WHERE id = ?`,
      [id]
    );
    
    if ((rows as any).length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    const currentStatus = (rows as any)[0].status;
    
    // Can only cancel pending or accepted rides
    if (!['pending', 'accepted'].includes(currentStatus)) {
      return res.status(400).json({ error: 'Cannot cancel a ride that has already started or completed' });
    }
    
    // Update ride status in database
    const [result] = await pool.execute(
      `UPDATE rides SET status = 'cancelled', updatedAt = NOW() WHERE id = ?`,
      [id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    res.status(500).json({ error: 'Failed to cancel ride' });
  }
};

// Apply ridesharing discount
export const applyRidesharingDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { discountPercentage } = req.body;
    
    // Validate discount
    if (discountPercentage < 0 || discountPercentage > 50) {
      return res.status(400).json({ error: 'Discount must be between 0 and 50 percent' });
    }
    
    // Get current ride details
    const [rows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    if ((rows as any).length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    const ride = (rows as any)[0];
    
    // Calculate new fare with discount
    const newFare = ride.fare * (1 - (discountPercentage / 100));
    
    // Update ride in database
    const [result] = await pool.execute(
      `UPDATE rides SET 
        fare = ?, 
        isShared = 1, 
        appliedDiscount = ?, 
        updatedAt = NOW() 
      WHERE id = ?`,
      [newFare.toFixed(2), discountPercentage, id]
    );
    
    // Get updated ride
    const [updatedRows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    res.json({ ride: (updatedRows as any)[0] });
  } catch (error) {
    console.error('Error applying ridesharing discount:', error);
    res.status(500).json({ error: 'Failed to apply discount' });
  }
};

// Add a stop to an ongoing ride
export const addStopToRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stopAddress } = req.body;
    
    // Get ride details
    const [rows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    if ((rows as any).length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    const ride = (rows as any)[0];
    
    // Check if ride is in a valid state
    if (!['accepted', 'ongoing'].includes(ride.status)) {
      return res.status(400).json({ error: 'Can only add stops to accepted or ongoing rides' });
    }
    
    // Get current position count
    const [stopsRows] = await pool.execute(
      `SELECT COUNT(*) as count FROM ride_stops WHERE rideId = ?`,
      [id]
    );
    
    const position = (stopsRows as any)[0].count;
    
    // Add stop to database
    const [result] = await pool.execute(
      `INSERT INTO ride_stops (rideId, address, lat, lng, isCompleted, position)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        stopAddress,
        Math.random() * 180 - 90, // Random lat
        Math.random() * 360 - 180, // Random lng
        false,
        position
      ]
    );
    
    // Recalculate fare (additional $2 per stop is a simple approach)
    const additionalFare = 2.00;
    const newFare = ride.fare + additionalFare;
    
    // Update ride fare
    await pool.execute(
      `UPDATE rides SET fare = ?, updatedAt = NOW() WHERE id = ?`,
      [newFare.toFixed(2), id]
    );
    
    // Get updated ride with all stops
    const [updatedRows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    const [updatedStopsRows] = await pool.execute(
      `SELECT * FROM ride_stops WHERE rideId = ? ORDER BY position ASC`,
      [id]
    );
    
    const updatedRide = {
      ...(updatedRows as any)[0],
      stops: updatedStopsRows
    };
    
    res.json({ ride: updatedRide });
  } catch (error) {
    console.error('Error adding stop to ride:', error);
    res.status(500).json({ error: 'Failed to add stop to ride' });
  }
};

// Change ride destination
export const changeRideDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newDestination } = req.body;
    
    // Get ride details
    const [rows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    if ((rows as any).length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    const ride = (rows as any)[0];
    
    // Check if ride is in a valid state
    if (!['accepted', 'ongoing'].includes(ride.status)) {
      return res.status(400).json({ error: 'Can only change destination of accepted or ongoing rides' });
    }
    
    // Update destination
    const newLat = Math.random() * 180 - 90;
    const newLng = Math.random() * 360 - 180;
    
    // In a real app, you would recalculate the route here using a mapping service
    const newDistance = ride.distance + Math.floor(Math.random() * 5) - 2; // Change by -2 to +2 km
    const newDuration = newDistance * 3; // 3 minutes per km
    
    // Recalculate fare based on new distance
    const baseRate = ride.rideType === 'premium' ? 3 : ride.rideType === 'eco' ? 1.5 : 2;
    const distanceRate = ride.rideType === 'premium' ? 2 : ride.rideType === 'eco' ? 1 : 1.5;
    const durationRate = ride.rideType === 'premium' ? 0.5 : ride.rideType === 'eco' ? 0.2 : 0.3;
    
    let newFare = baseRate + (newDistance * distanceRate) + (newDuration * durationRate);
    
    // Apply eco discount if applicable
    if (ride.rideType === 'eco') {
      newFare = newFare * 0.9;
    }
    
    // Apply weather adjustment if applicable
    if (ride.weatherAdjustment) {
      newFare = newFare * (1 + ride.weatherAdjustment);
    }
    
    // Apply ridesharing discount if applicable
    if (ride.isShared && ride.appliedDiscount) {
      newFare = newFare * (1 - (ride.appliedDiscount / 100));
    }
    
    newFare = parseFloat(newFare.toFixed(2));
    
    // Update ride in database
    const [result] = await pool.execute(
      `UPDATE rides SET 
        endAddress = ?, 
        endLat = ?, 
        endLng = ?,
        distance = ?,
        duration = ?,
        fare = ?,
        updatedAt = NOW()
      WHERE id = ?`,
      [newDestination, newLat, newLng, newDistance, newDuration, newFare, id]
    );
    
    // Get updated ride
    const [updatedRows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    const [stopsRows] = await pool.execute(
      `SELECT * FROM ride_stops WHERE rideId = ? ORDER BY position ASC`,
      [id]
    );
    
    const updatedRide = {
      ...(updatedRows as any)[0],
      stops: stopsRows
    };
    
    res.json({ ride: updatedRide });
  } catch (error) {
    console.error('Error changing ride destination:', error);
    res.status(500).json({ error: 'Failed to change ride destination' });
  }
};

// Generate a split payment link
export const generateSplitPaymentLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { numberOfPeople } = req.body;
    
    // Get ride details
    const [rows] = await pool.execute(
      `SELECT * FROM rides WHERE id = ?`,
      [id]
    );
    
    if ((rows as any).length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    const ride = (rows as any)[0];
    
    // Calculate split amount
    const splitAmount = parseFloat((ride.fare / numberOfPeople).toFixed(2));
    
    // Generate a unique link
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const link = `https://gocabs.app/split/${id}/${uniqueId}`;
    
    // In a real app, you would save this link to a database
    // Here we'll just update the ride with the split payment link
    await pool.execute(
      `UPDATE rides SET splitPaymentLink = ?, updatedAt = NOW() WHERE id = ?`,
      [link, id]
    );
    
    res.json({ link, amount: splitAmount });
  } catch (error) {
    console.error('Error generating split payment link:', error);
    res.status(500).json({ error: 'Failed to generate split payment link' });
  }
};
