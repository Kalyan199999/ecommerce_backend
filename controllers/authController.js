const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => 
  {
      const { name, email, password, isAdmin } = req.body;
      try 
      {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const newUser = new User({ name, email, password: hashedPassword, isAdmin });
        const user = await newUser.save();
  
        res.status(201).json({ msg: 'User registered successfully' , user:user });
      } 
      catch (err) 
      {
        res.status(500).json({ error: err.message });
      }
  };

const loginUser = async (req, res) => 
    {
        const { email, password } = req.body;

        try 
        {
          const user = await User.findOne({ email });

          if (!user) return res.status(404).json({ msg: 'User not found' });
      
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
      
          const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '7d',
          });
      
          return res.status(200).json({ token, user: { id: user._id, email: user.email,name:user.name, isAdmin: user.isAdmin } });
        } 
        catch (err) 
        {
          return res.status(500).json({ error: err.message });
        }
};

const getAll = async (req, res) =>{
    try {
      const users = await User.find();
      return res.status(200).json({message:"users fetched successfully",users});
    } 
    catch (error) {
      return res.status(500).json({message:"Error",error: err.message});
    }
}

module.exports = { 
  registerUser, 
  loginUser ,
  getAll
};
