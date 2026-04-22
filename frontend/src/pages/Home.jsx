import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingService } from '../services/listingService';
import { categoryService } from '../services/categoryService';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  ComputerDesktopIcon,
  ShoppingBagIcon,
  TruckIcon,
  HomeIcon,
  WrenchIcon,
  FireIcon,
  BookOpenIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [latestListings, setLatestListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);

  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, listingsData] = await Promise.all([
          categoryService.getAll(),
          listingService.getAll({ limit: 6 })
        ]);
        setCategories(categoriesData);
        setLatestListings(listingsData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategory) params.append('category_id', selectedCategory);
    if (selectedCity) params.append('city', selectedCity);
    
    window.location.href = `/listings?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Rent Anything in Pakistan
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Find and rent items from people in your community
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                className="mt-4 w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Search Items
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/listings?category_id=${category.id}`}
                className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors"
              >
                <div className="text-4xl mb-4 flex justify-center">
                  {category.icon === 'laptop' && <ComputerDesktopIcon className="h-12 w-12 text-primary-600" />}
                  {category.icon === 'shirt' && <ShoppingBagIcon className="h-12 w-12 text-primary-600" />}
                  {category.icon === 'car' && <TruckIcon className="h-12 w-12 text-primary-600" />}
                  {category.icon === 'sofa' && <HomeIcon className="h-12 w-12 text-primary-600" />}
                  {category.icon === 'wrench' && <WrenchIcon className="h-12 w-12 text-primary-600" />}
                  {category.icon === 'cricket' && <FireIcon className="h-12 w-12 text-primary-600" />}
                  {category.icon === 'book' && <BookOpenIcon className="h-12 w-12 text-primary-600" />}
                  {category.icon === 'party' && <GiftIcon className="h-12 w-12 text-primary-600" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest Listings</h2>
            <Link
              to="/listings"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Items
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestListings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={`http://localhost:8001/storage/${listing.images[0].image_path}`}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{listing.city}</span>
                  </div>
                  <div className="flex items-center text-gray-900">
                    <CurrencyDollarIcon className="h-5 w-5 mr-1 text-primary-600" />
                    <span className="font-semibold">PKR {listing.price_per_day}/day</span>
                  </div>
                  {listing.security_deposit && (
                    <p className="text-sm text-gray-600 mt-1">
                      Security: PKR {listing.security_deposit}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How RentPay Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Items</h3>
              <p className="text-gray-600">Search through our collection of rental items in your area</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request to Rent</h3>
              <p className="text-gray-600">Send a rental request to the item owner with your dates</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect & Rent</h3>
              <p className="text-gray-600">Once accepted, connect with the owner and arrange pickup</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
