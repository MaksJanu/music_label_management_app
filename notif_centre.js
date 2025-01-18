import mqtt from 'mqtt';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

// Create separate MongoDB connection
const notifConnection = mongoose.createConnection(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 45000,
});

// Define User Schema
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true 
    },
    role: { 
        type: String,
        enum: ['user', 'artist'],
        required: true 
    },
    profilePicture: { 
        data: Buffer,
        contentType: String,
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    permissions: { 
        type: [String],
        default: [] 
    },
    name: { 
        type: String,
        required: function() { return this.role === "artist" }
    },
    genre: {
        type: String,
        required: false
    },
    albums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
        required: false
    }],
    studioSessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudioSession",
        required: false
    }],
    bio: { 
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
});

// Add password validation method
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Create User model with separate connection
const User = notifConnection.model('User', userSchema);

// Handle MongoDB connection events
notifConnection.on('connected', () => {
    console.log('Notification service connected to MongoDB');
    initializeMQTT();
});

notifConnection.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

notifConnection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    setTimeout(reconnect, 5000);
});

async function reconnect() {
    try {
        await notifConnection.openUri(process.env.MONGODB_URL);
    } catch (error) {
        console.error('Failed to reconnect:', error);
    }
}

// MQTT client initialization
function initializeMQTT() {
    const client = mqtt.connect("mqtt://localhost:1883");

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe('artist/+/new-album');
        client.subscribe('artist/+/new-session');
    });

    client.on('error', (error) => {
        console.error('MQTT connection error:', error);
    });

    client.on('message', async (topic, message) => {
        const [_, , eventType] = topic.split('/');
        const data = JSON.parse(message.toString());

        if (eventType === 'new-album' || eventType === 'new-session') {
            try {
                const users = await User.find({ role: 'user' });
                for (const user of users) {
                    await sendEmail(user.email, eventType, data);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        }
    });
}

async function sendEmail(to, eventType, data) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NOT_EMAIL,
            pass: process.env.NOT_PASSWORD
        }
    });


    const mailOptions = {
        from: `"Track Trail" <${process.env.NOT_EMAIL}>`,
        to: to,
        subject: `New ${eventType.replace('-', ' ').replace('new', '')} Notification`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2c3e50;">New ${eventType.replace('-', ' ').replace('new', '')} Notification</h2>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h3 style="margin-top: 0;">Details:</h3>
                    ${Object.entries(data)
                        .filter(([key]) => !['image', '__v', '_id'].includes(key))
                        .map(([key, value]) => `
                            <p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</p>
                        `).join('')}
                </div>
                <p style="color: #666; font-size: 12px;">This is an automated notification from Music Label Management System</p>
            </div>
        `,
        text: `New ${eventType.replace('-', ' ')}\n\nDetails:\n${Object.entries(data)
            .filter(([key]) => !['Image', '__v', '_id'].includes(key))
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join('\n')}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully', info.messageId);
    } catch (err) {
        console.error('Failed to send email:', err);
    }
}