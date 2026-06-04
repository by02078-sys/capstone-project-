import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// API Endpoint to get Allure summary data
app.get('/api/summary', (req, res) => {
    const summaryPath = path.join(__dirname, 'allure-report', 'widgets', 'summary.json');
    if (fs.existsSync(summaryPath)) {
        try {
            const data = fs.readFileSync(summaryPath, 'utf8');
            res.json({
                available: true,
                data: JSON.parse(data)
            });
        } catch (err) {
            res.status(500).json({ available: false, error: 'Failed to parse report summary' });
        }
    } else {
        res.json({
            available: false,
            message: 'No test execution report has been compiled yet.'
        });
    }
});

// Serve static Allure Report files
app.use('/report', express.static(path.join(__dirname, 'allure-report')));

// Serve dashboard frontend
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Express dashboard server running on port ${PORT}`);
});