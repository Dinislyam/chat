const { createServer } = require('http');
const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://spuojxymnacbjtlpwhcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdW9qeHltbmFjYmp0bHB3aGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY5NDk1NTgsImV4cCI6MjAyMjUyNTU1OH0.V60UE1nJDgHLVMWvZsNCK1QMZpIvbJCS8B_ziY2Cxh0';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.static('public')); // Где 'public' - это папка, содержащая ваши статические файлы, включая 'client.js'
const server = createServer(app); // Создаем сервер с помощью createServer
const io = socketIo(server); // Используем созданный сервер для инициализации socket.io

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  io.on('connection', (socket) => {
    socket.on('getInitialMessages', async () => {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*');

        if (error) {
            // Обработка ошибки извлечения сообщений из Supabase
        } else {
            socket.emit('initialMessages', messages);
        }
    });

    socket.on('message', async (data) => {
        const { data: message, error } = await supabase
            .from('messages')
            .insert([{ text: data.message, time: new Date() }]);

        if (error) {
            // Обработка ошибки сохранения сообщения в Supabase
        } else {
            io.emit('message', data);
        }
    });
    });

  

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })  ;