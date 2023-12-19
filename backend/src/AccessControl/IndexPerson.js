/* const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/people', async (req, res) => {
    const people = await prisma.persons.findMany();
    const formattedPeople = people.map(persons => ({
        id: persons.PersonID,
        title: `${persons.Lastname}, ${persons.Firstname}`,
        // Add other fields as needed
    }));
    res.json(formattedPeople);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

 */