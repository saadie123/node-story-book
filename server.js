const express = require('express');

const authRoutes = require('./routes/auth');
const app = express();


app.get('/', (req, res) => {
    res.send('Story Book app is running');
});

app.use('/auth',authRoutes);

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});