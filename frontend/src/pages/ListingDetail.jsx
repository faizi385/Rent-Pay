import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { listingService } from '../services/listingService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext.jsx';
import {
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const ListingDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  const listingRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await listingService.getById(id);
        setListing(data);
        listingRef.current = data; // Store in ref
      } catch (err) {
        setError('Listing not found');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, isAuthenticated]); // Remove user from dependencies

  const handleBookingSubmit = async (data) => {
    // Use ref to prevent loss during async operation
    const currentListing = listingRef.current || listing;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!currentListing || currentListing.user.id === user.id) {
      setError('You cannot book your own listing');
      return;
    }

    // Validate dates
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setError('Start date cannot be in the past');
      return;
    }

    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    setError('');
    setBookingLoading(true);

    try {
      const bookingData = {
        listing_id: currentListing.id,
        start_date: data.start_date,
        end_date: data.end_date,
        message: data.message || '',
      };

      const result = await bookingService.create(bookingData);

      // Close modal and reset form
      setShowBookingForm(false);
      reset();
      
      // Show success toast
      if (window.showToast) {
        window.showToast('Booking request sent successfully!', 'success');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.message || 'Failed to send booking request';
      
      // Show error toast
      if (window.showToast) {
        window.showToast(errorMessage, 'error');
      }
      
      // Don't set error state for validation errors to prevent listing loss
      if (err.response?.status !== 422) {
        setError(errorMessage);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!currentListing.user.phone) {
      setError('Phone number not available');
      return;
    }

    const message = `Hi! I'm interested in renting your "${currentListing.title}" from RentPay. Is it still available?`;
    const whatsappUrl = `https://wa.me/${currentListing.user.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const nextImage = () => {
    if (currentListing.images && currentListing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % currentListing.images.length);
    }
  };

  const prevImage = () => {
    if (currentListing.images && currentListing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + currentListing.images.length) % currentListing.images.length);
    }
  };

  const openFullScreenImage = (index) => {
    setFullScreenImageIndex(index);
    setShowFullScreenImage(true);
  };

  const closeFullScreenImage = () => {
    setShowFullScreenImage(false);
  };

  const nextFullScreenImage = () => {
    if (currentListing.images && currentListing.images.length > 0) {
      setFullScreenImageIndex((prev) => (prev + 1) % currentListing.images.length);
    }
  };

  const prevFullScreenImage = () => {
    if (currentListing.images && currentListing.images.length > 0) {
      setFullScreenImageIndex((prev) => (prev - 1 + currentListing.images.length) % currentListing.images.length);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || (!listing && !listingRef.current)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/listings')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  // Use ref as fallback if state is lost
  const currentListing = listing || listingRef.current;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <button onClick={() => navigate('/listings')} className="hover:text-gray-700">
            Listings
          </button>
          <span>/</span>
          <span className="text-gray-900">{currentListing.title}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              {currentListing.images && currentListing.images.length > 0 ? (
                <>
                  <img
                    src={`http://localhost:8001/storage/${currentListing.images[currentImageIndex].image_path}`}
                    alt={currentListing.title}
                    className="w-full h-96 object-cover cursor-pointer transition-transform hover:scale-105"
                    onClick={() => openFullScreenImage(currentImageIndex)}
                  />
                  {currentListing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <PhotoIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {currentListing.images && currentListing.images.length > 1 && (
              <div className="flex space-x-2 p-4 overflow-x-auto">
                {currentListing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      openFullScreenImage(index);
                    }}
                    className={`flex-shrink-0 transition-all hover:scale-105 ${currentImageIndex === index ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <img
                      src={`http://localhost:8001/storage/${image.image_path}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  <span>{listing.city}</span>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Available
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Category</h2>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {listing.category.name}
              </span>
            </div>

            {listing.address && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Location</h2>
                <p className="text-gray-600">{listing.address}</p>
              </div>
            )}
          </div>

          {/* Booking Modal */}
          {showBookingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Request to Rent</h2>
                    <button
                      onClick={() => {
                        setShowBookingForm(false);
                        setError('');
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit(handleBookingSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          {...register('start_date', { required: 'Start date is required' })}
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.start_date && (
                          <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date *
                        </label>
                        <input
                          {...register('end_date', { 
                            required: 'End date is required',
                            validate: (value) => {
                              const startDate = getValues('start_date');
                              if (startDate && value <= startDate) {
                                return 'End date must be after start date';
                              }
                              return true;
                            }
                          })}
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.end_date && (
                          <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        {...register('message')}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Add a message for the owner..."
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBookingForm(false);
                          setError('');
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bookingLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </div>
                        ) : (
                          'Send Request'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>
            <div className="flex items-center text-gray-900 mb-4">
              <CurrencyDollarIcon className="h-6 w-6 mr-2 text-primary-600" />
              <span className="text-2xl font-bold">PKR {listing.price_per_day}</span>
              <span className="text-gray-600 ml-2">/day</span>
            </div>
            
            {listing.security_deposit && (
              <div className="border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Security Deposit:</span>
                  <span className="font-medium">PKR {listing.security_deposit}</span>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  if (!isAuthenticated || !user) {
                    navigate('/login');
                    return;
                  }
                  
                  if (listing?.user?.id === user?.id) {
                    setError('You cannot book your own listing');
                    return;
                  }
                  
                  setShowBookingForm(true);
                }}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold"
              >
                Request to Rent
              </button>
              
              {listing.user.phone && (
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Contact via WhatsApp
                </button>
              )}
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Owner</h2>
            <div className="flex items-center mb-4">
              {listing.user.profile_image ? (
                <img
                  src={`http://localhost:8001/storage/${listing.user.profile_image}`}
                  alt={listing.user.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{listing.user.name}</h3>
                <p className="text-sm text-gray-600">{listing.user.city}</p>
              </div>
            </div>
            
            {listing.user.bio && (
              <p className="text-gray-600 text-sm mb-4">{listing.user.bio}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Member since</span>
              <span className="text-sm text-gray-600">
                {new Date(listing.user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Viewer */}
      {showFullScreenImage && currentListing.images && currentListing.images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeFullScreenImage}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={`http://localhost:8001/storage/${currentListing.images[fullScreenImageIndex].image_path}`}
              alt={`${currentListing.title} ${fullScreenImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: 'calc(100vh - 2rem)', maxWidth: 'calc(100vw - 2rem)' }}
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Navigation Arrows */}
            {currentListing.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevFullScreenImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextFullScreenImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Close Button */}
            <button
              onClick={closeFullScreenImage}
              className="absolute top-4 right-4 bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image Counter */}
            {currentListing.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {fullScreenImageIndex + 1} / {currentListing.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;
