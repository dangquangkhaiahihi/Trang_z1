import express from 'express';
import { personModel } from './backend/Persons/Relationships/Persons/person.model';

const app = express();
const port = 8080;

app.get('/api/people', async (req, res) => {
    try {
        const persons = await prisma.person.findMany({
            select: personModel,
        });

        res.json(persons);
    } catch (error) {
        console.error('Error fetching persons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});