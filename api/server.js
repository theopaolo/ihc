import { readFile, writeFile } from 'fs/promises';
import { createServer } from 'http';

const FILE_PATH = './likes.json';
const PORT = 3000;

// Ensure the file exists
async function init() {
    try {
        await readFile(FILE_PATH, 'utf-8');
    } catch {
        await writeFile(FILE_PATH, JSON.stringify({ likes: 0 }), 'utf-8');
    }
}

// Read likes
async function getLikes() {
    const data = await readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data).likes;
}

// Increment likes
async function addLike() {
    const likes = await getLikes();
    const newLikes = likes + 1;
    await writeFile(FILE_PATH, JSON.stringify({ likes: newLikes }), 'utf-8');
    return newLikes;
}

// Create HTTP Server
createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow frontend requests

    if (req.url === '/likes' && req.method === 'GET') {
        res.end(JSON.stringify({ likes: await getLikes() }));
    } else if (req.url === '/like' && req.method === 'POST') {
        res.end(JSON.stringify({ likes: await addLike() }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
}).listen(PORT, async () => {
    await init();
    console.log(`Server running at http://localhost:${PORT}`);
});