const bcrypt = require('bcryptjs');
const password = 'password123';
const hash = '$2a$10$xA/m3H0s.74zN/LjeSF0vum5btRtenKf7LqQcnVIaZr2IMkpyp5jC';

bcrypt.compare(password, hash).then(res => {
    console.log('Match:', res);
}).catch(err => {
    console.error(err);
});
