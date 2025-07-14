import React, { useState, useEffect, useRef } from 'react';
import gpsService from '../services/gpsService';
import ApiService from '../services/api';

const LocationTracker = ({ 
  rideId, 
  isDriver = false, 
  onLocationUpdate = null,
  updateInterval = 10000, // 10 seconds
  className = "" 
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const trackingIntervalRef = useRef(null);

  useEffect(() => {
    checkPermission();
    return () => {
      stopTracking();
    };
  }, []);

  const checkPermission = async () => {
    try {
      const status = await gpsService.checkLocationPermission();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error checking permission:', error);
      setPermissionStatus('denied');
    }
  };

  const requestPermission = async () => {
    try {
      const status = await gpsService.requestLocationPermission();
      setPermissionStatus(status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      setPermissionStatus('denied');
      return false;
    }
  };

  const startTracking = async () => {
    if (isTracking) return;

    try {
      // Request permission if needed
      if (permissionStatus !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setError('Location permission is required for tracking');
          return;
        }
      }

      setIsTracking(true);
      setError(null);

      // Get initial location
      const location = await gpsService.getCurrentLocation();
      setCurrentLocation(location);
      setLastUpdate(new Date());

      // Update location to server
      if (rideId) {
        if (isDriver) {
          await ApiService.updateRideLocation(rideId, location.latitude, location.longitude);
        } else {
          await ApiService.updateUserLocation(location.latitude, location.longitude);
        }
      }

      // Call callback if provided
      if (onLocationUpdate) {
        onLocationUpdate(location);
      }

      // Start periodic updates
      trackingIntervalRef.current = setInterval(async () => {
        try {
          const newLocation = await gpsService.getCurrentLocation();
          setCurrentLocation(newLocation);
          setLastUpdate(new Date());

          // Update location to server
          if (rideId) {
            if (isDriver) {
              await ApiService.updateRideLocation(rideId, newLocation.latitude, newLocation.longitude);
            } else {
              await ApiService.updateUserLocation(newLocation.latitude, newLocation.longitude);
            }
          }

          // Call callback if provided
          if (onLocationUpdate) {
            onLocationUpdate(newLocation);
          }
        } catch (error) {
          console.error('Error updating location:', error);
          setError('Failed to update location');
        }
      }, updateInterval);

    } catch (error) {
      console.error('Error starting location tracking:', error);
      setError('Failed to start location tracking');
      setIsTracking(false);
    }
  };

  const stopTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    setIsTracking(false);
  };

  const formatTime = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  const formatCoordinates = (location) => {
    if (!location) return 'Unknown';
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  };

  return (
    <div className={`location-tracker ${className}`}>
      <div className="tracker-header">
        <h4>Location Tracking</h4>
        <div className="tracker-status">
          <span className={`status-indicator ${isTracking ? 'active' : 'inactive'}`}>
            {isTracking ? '●' : '○'}
          </span>
          <span className="status-text">
            {isTracking ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {currentLocation && (
        <div className="location-info">
          <div className="location-item">
            <label>Coordinates:</label>
            <span>{formatCoordinates(currentLocation)}</span>
          </div>
          <div className="location-item">
            <label>Accuracy:</label>
            <span>{currentLocation.accuracy ? `${Math.round(currentLocation.accuracy)}m` : 'Unknown'}</span>
          </div>
          <div className="location-item">
            <label>Last Update:</label>
            <span>{formatTime(lastUpdate)}</span>
          </div>
        </div>
      )}

      <div className="tracker-controls">
        {permissionStatus === 'denied' && (
          <div className="permission-warning">
            <i className="fas fa-lock"></i>
            Location permission denied. Please enable location access in your browser settings.
          </div>
        )}

        {!isTracking ? (
          <button
            onClick={startTracking}
            disabled={permissionStatus === 'denied'}
            className="btn btn-primary"
          >
            <i className="fas fa-play"></i>
            Start Tracking
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="btn btn-danger"
          >
            <i className="fas fa-stop"></i>
            Stop Tracking
          </button>
        )}
      </div>

      <style>{`
        .location-tracker {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .tracker-header h4 {
          margin: 0;
          color: #333;
        }

        .tracker-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-indicator {
          font-size: 12px;
          font-weight: bold;
        }

        .status-indicator.active {
          color: #28a745;
        }

        .status-indicator.inactive {
          color: #dc3545;
        }

        .status-text {
          font-size: 14px;
          color: #666;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .location-info {
          margin-bottom: 16px;
        }

        .location-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 4px 0;
        }

        .location-item label {
          font-weight: 500;
          color: #666;
        }

        .location-item span {
          color: #333;
          font-family: monospace;
        }

        .tracker-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .permission-warning {
          background: #fff3cd;
          color: #856404;
          padding: 8px 12px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.3s ease;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #c82333;
        }
      `}</style>
    </div>
  );
};

export default LocationTracker; 