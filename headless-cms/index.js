const express = require('express');
const app = express();
const cors = require('cors');
const entitiesRouter = require('./routes/entities');

require('dotenv').config();

app.use(cors()); 
app.use(express.json());
app.use('/entities', entitiesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//app.listen(5000, () => console.log('Server running on port 5000'));
