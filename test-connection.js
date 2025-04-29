import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

console.log('Attempting to connect with URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@')); // Logs URI without exposing credentials

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB.');
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Connection error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName,
      errorResponse: error.errorResponse
    });
    
    if (error.message.includes('bad auth')) {
      console.log('\nPossible auth issues to check:');
      console.log('1. Is the username correct?');
      console.log('2. Is the password correctly URL-encoded?');
      console.log('3. Is the database name correct?');
      console.log('4. Does the user have the correct permissions?');
    }
  }
}

testConnection(); 