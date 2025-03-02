const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const AZURE_API_URL = 'http://5b1e3590-5b4f-4266-b4d5-16f10730a19f.eastus2.azurecontainer.io/score'; 
const API_KEY = 'RX7TPG224ofJPSzdZgGfHacrTbb2cGHy'; 

app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  
});


app.post('/proxy', async (req, res) => {
    try {
        const response = await axios.post(AZURE_API_URL, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'An error occurred', message: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
