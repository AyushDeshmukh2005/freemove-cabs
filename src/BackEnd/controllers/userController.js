
const { pool } = require('../Database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, type = 'rider' } = req.body;
    
    // Check if email already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const now = new Date();
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password, type, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, type, now, now]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email, type },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: result.insertId,
        name,
        email,
        phone,
        type,
        token
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ success: false, message: 'Failed to register user' });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, type: user.type },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        token
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ success: false, message: 'Failed to login' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find user by id
    const [users] = await pool.query('SELECT id, name, email, phone, type, createdAt FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update user
    const now = new Date();
    await pool.query(
      'UPDATE users SET name = ?, phone = ?, updatedAt = ? WHERE id = ?',
      [name, phone, now, id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: {
        id: parseInt(id),
        name,
        phone
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ success: false, message: 'Failed to update user profile' });
  }
};

// Update quiet hours settings
const updateQuietHours = async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled, startTime, endTime, daysOfWeek } = req.body;
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if quiet hours already exist for user
    const [quietHours] = await pool.query('SELECT * FROM quiet_hours WHERE userId = ?', [id]);
    
    const now = new Date();
    
    if (quietHours.length === 0) {
      // Create new quiet hours entry
      await pool.query(
        'INSERT INTO quiet_hours (userId, enabled, startTime, endTime, daysOfWeek, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, enabled, startTime, endTime, JSON.stringify(daysOfWeek), now, now]
      );
    } else {
      // Update existing quiet hours
      await pool.query(
        'UPDATE quiet_hours SET enabled = ?, startTime = ?, endTime = ?, daysOfWeek = ?, updatedAt = ? WHERE userId = ?',
        [enabled, startTime, endTime, JSON.stringify(daysOfWeek), now, id]
      );
    }
    
    return res.status(200).json({
      success: true,
      message: 'Quiet hours settings updated successfully',
      data: {
        userId: parseInt(id),
        enabled,
        startTime,
        endTime,
        daysOfWeek
      }
    });
  } catch (error) {
    console.error('Error updating quiet hours settings:', error);
    return res.status(500).json({ success: false, message: 'Failed to update quiet hours settings' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateQuietHours
};
