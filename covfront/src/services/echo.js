import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configure Pusher
window.Pusher = Pusher;

// Create Echo instance with fallback configuration
const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.REACT_APP_PUSHER_APP_KEY || 'your-pusher-key',
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER || 'mt1',
  forceTLS: true,
  enabledTransports: ['ws', 'wss'], // Enable WebSocket transport
  disableStats: true, // Disable stats for better performance
  auth: {
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  },
});

// Add error handling
echo.connector.pusher.connection.bind('error', (error) => {
  console.error('Pusher connection error:', error);
});

echo.connector.pusher.connection.bind('connected', () => {
  console.log('Pusher connected successfully');
});

export default echo; 