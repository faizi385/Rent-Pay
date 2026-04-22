import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext.jsx';
import {
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const BookingRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, activeTab]);

  const fetchRequests = async () => {
    try {
      const data = await bookingService.getAll(activeTab);
      setRequests(data.data || []);
    } catch (err) {
      setError('Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await bookingService.update(requestId, { status });
      setSuccess(`Booking request ${status} successfully!`);
      fetchRequests();
    } catch (err) {
      setError('Failed to update booking request');
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this booking request?')) {
      return;
    }

    try {
      await bookingService.delete(requestId);
      setSuccess('Booking request deleted successfully!');
      fetchRequests();
    } catch (err) {
      setError('Failed to delete booking request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5" />;
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view booking requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
        <p className="text-gray-600 mt-2">Manage rental requests for your listings</p>
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Requests Received ({requests.filter(r => r.listing.user.id === user.id).length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Requests Sent ({requests.filter(r => r.renter.id === user.id).length})
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <CalendarIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'received' ? 'requests received' : 'requests sent'}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'received'
              ? 'You haven\'t received any booking requests yet.'
              : 'You haven\'t sent any booking requests yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                    <span className="ml-3 text-sm text-gray-500">
                      Request #{request.id}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {activeTab === 'received' ? 'Request for:' : 'Your request for:'}{' '}
                    <span className="text-primary-600">{request.listing.title}</span>
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    <span>PKR {request.listing.price_per_day}/day</span>
                    {request.listing.security_deposit && (
                      <span className="ml-3">+ PKR {request.listing.security_deposit} deposit</span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{request.listing.city}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</span>
                  </div>
                  
                  {request.message && (
                    <div className="bg-gray-50 rounded-md p-3 mb-4">
                      <div className="flex items-center mb-2">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Message:</span>
                      </div>
                      <p className="text-gray-600 text-sm">{request.message}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.location.href = `/listings/${request.listing.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Listing
                  </button>
                  
                  {activeTab === 'received' && request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'accepted')}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* User Info */}
              <div className="border-t pt-4">
                <div className="flex items-center">
                  {activeTab === 'received' ? (
                    <>
                      <div className="flex items-center mr-4">
                        {request.renter.profile_image ? (
                          <img
                            src={`http://localhost:8001/storage/${request.renter.profile_image}`}
                            alt={request.renter.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{request.renter.name}</p>
                          <p className="text-sm text-gray-500">{request.renter.email}</p>
                          <p className="text-sm text-gray-500">{request.renter.city}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mr-4">
                        {request.listing.user.profile_image ? (
                          <img
                            src={`http://localhost:8001/storage/${request.listing.user.profile_image}`}
                            alt={request.listing.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{request.listing.user.name}</p>
                          <p className="text-sm text-gray-500">{request.listing.user.email}</p>
                          <p className="text-sm text-gray-500">{request.listing.user.city}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
