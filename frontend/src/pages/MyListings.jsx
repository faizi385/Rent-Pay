import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingService } from '../services/listingService';
import { useAuth } from '../context/AuthContext.jsx';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await listingService.getMyListings();
      setListings(data.data || []);
    } catch (err) {
      setError('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      await listingService.delete(listingId);
      setSuccess('Listing deleted successfully!');
      fetchListings();
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  const handleToggleAvailability = async (listing) => {
    try {
      await listingService.update(listing.id, {
        ...listing,
        is_available: !listing.is_available,
      });
      setSuccess(`Listing marked as ${!listing.is_available ? 'available' : 'unavailable'}!`);
      fetchListings();
    } catch (err) {
      setError('Failed to update listing');
    }
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    if (filter === 'available') return listing.is_available;
    if (filter === 'unavailable') return !listing.is_available;
    return true;
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your listings.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">Manage your rental items</p>
          </div>
          <button
            onClick={() => navigate('/create-listing')}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Listing
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      {/* Filters */}
      {listings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({listings.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'available'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Available ({listings.filter(l => l.is_available).length})
            </button>
            <button
              onClick={() => setFilter('unavailable')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'unavailable'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unavailable ({listings.filter(l => !l.is_available).length})
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M5 7a2 2 0 012-2h6a2 2 0 012 2v2M7 17a1 1 0 100-2 0 1 1 0 012 0zm0 0a1 1 0 100-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No listings yet' : `No ${filter} listings`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'You haven\'t created any listings yet. Start by adding your first rental item.'
              : `You don't have any ${filter} listings.`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/create-listing')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Create Your First Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={`http://localhost:8001/storage/${listing.images[0].image_path}`}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    listing.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {listing.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {listing.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {listing.description}
                </p>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">{listing.city}</span>
                </div>
                
                <div className="flex items-center text-gray-900 mb-4">
                  <CurrencyDollarIcon className="h-5 w-5 mr-1 text-primary-600" />
                  <span className="font-semibold">PKR {listing.price_per_day}/day</span>
                </div>
                
                {listing.security_deposit && (
                  <div className="text-sm text-gray-600 mb-4">
                    Security: PKR {listing.security_deposit}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Category: {listing.category.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/listings/${listing.id}`)}
                      className="text-primary-600 hover:text-primary-700"
                      title="View"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/edit-listing/${listing.id}`)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
