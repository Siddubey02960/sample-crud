const { v4: uuidv4 } = require('uuid');
const { addUserValidation, getUserValidation, updateUserValidation } = require('../validation/index');
const users = [
    // {
    //     id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    //     username: 'Dummy1',
    //     hobbies: ['dance', 'music'],
    //     age : 12,
    // },
    // {
    //     id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    //     name: 'Dummy2',
    //     hobbies: ['dance', 'music'],
    //     age : 23,
    // }
];

const getList = async (req, res, next) => {
    try{
        res.status(200).json(users);
    }catch(err){
        return next(err);
    }
};

const getOne = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        await getUserValidation.validateAsync(userId);
        const user = users.find(u => u.id === userId);
      
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
      
        res.status(200).json(user);
    } catch(err){
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid User Id' });
        }
        return next(err);
    }

}

const addOne = async(req, res, next) => {
    try{
        const { username, age, hobbies } = req.body;
        await addUserValidation.validateAsync(req.body);

        const newUser = {
          id: uuidv4(),
          username,
          age,
          hobbies: hobbies || [],
        };
      
        users.push(newUser);
        res.status(201).json(newUser);
    }catch(err){
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return next(err);
    }
}

const updateOne = async (req, res, next) => {
    try{
        const { userId } = req.params;
        const { username, age, hobbies } = req.body;
        
        await getUserValidation.validateAsync(userId);
        await updateUserValidation.validateAsync(req.body);

        const userIndex = users.findIndex(u => u.id === userId);
      
        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }
      
        const updatedUser = {
          id: userId,
          username: username || users[userIndex].username,
          age: age || users[userIndex].age,
          hobbies: hobbies || users[userIndex].hobbies,
        };
      
        users[userIndex] = updatedUser;
        res.status(200).json(updatedUser);
    }catch(err){
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid User Id' });
        }
        return next(err);
    }
}

const deleteOne = async (req, res, next) => {
    try{
        const { userId } = req.params;
        await getUserValidation.validateAsync(userId);

        const userIndex = users.findIndex(u => u.id === userId);

        const user = users[userIndex];
      
        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }
      
        users.splice(userIndex, 1);
        res.status(204).send();
    }catch(err){
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return next(err);
    }
}

module.exports = {
    addOne,
    getList,
    getOne,
    updateOne,
    deleteOne
}