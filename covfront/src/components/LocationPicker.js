import React, { useState, useEffect, useRef } from 'react';
import gpsService from '../services/gpsService';

const LocationPicker = ({ 
  onLocationSelect, 
  placeholder = "Enter location...", 
  initialValue = "",
  showCurrentLocation = true,
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (showCurrentLocation) {
      getCurrentLocation();
    }
  }, [showCurrentLocation]);

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const location = await gpsService.getCurrentLocation();
      setCurrentLocation(location);
      
      // Get address for current location
      const address = await gpsService.reverseGeocode(location.latitude, location.longitude);
      setSearchTerm(address.address);
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        
        const formattedSuggestions = data.map(item => ({
          id: item.place_id,
          display_name: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          city: item.address?.city || item.address?.town || item.address?.village,
          country: item.address?.country
        }));
        
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error searching locations:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    if (onLocationSelect) {
      onLocationSelect({
        address: suggestion.display_name,
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
        city: suggestion.city,
        country: suggestion.country
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      gpsService.reverseGeocode(currentLocation.latitude, currentLocation.longitude)
        .then(address => {
          setSearchTerm(address.address);
          if (onLocationSelect) {
            onLocationSelect({
              address: address.address,
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              city: address.city,
              country: address.country
            });
          }
        })
        .catch(error => {
          console.error('Error getting address for current location:', error);
        });
    }
  };

  return (
    <div className={`location-picker ${className}`}>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="location-input"
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
        />
        
        {showCurrentLocation && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={!currentLocation || isLoading}
            className="current-location-btn"
            title="Use current location"
          >
            <i className="fas fa-crosshairs"></i>
          </button>
        )}
        
        {isLoading && (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-container">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="suggestion-address">{suggestion.display_name}</div>
              {suggestion.city && (
                <div className="suggestion-city">{suggestion.city}, {suggestion.country}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .location-picker {
          position: relative;
          width: 100%;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .location-input {
          width: 100%;
          padding: 12px 40px 12px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .location-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .current-location-btn {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }

        .current-location-btn:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }

        .current-location-btn:disabled {
          color: #ccc;
          cursor: not-allowed;
        }

        .loading-spinner {
          position: absolute;
          right: 40px;
          color: #007bff;
        }

        .suggestions-container {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
        }

        .suggestion-item {
          padding: 12px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.3s ease;
        }

        .suggestion-item:hover {
          background-color: #f8f9fa;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-address {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .suggestion-city {
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default LocationPicker; 