import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function Interest() {
  const { isLoggedIn, user } = useAuth();
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  const fetchInterestList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/interest/${user.userDetails.userID}`);
      setInterests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interest list:', error);
      setLoading(false);
    }
  }, [user.userDetails.userID]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchInterestList();
    }
  }, [isLoggedIn, fetchInterestList]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetailsData = await Promise.all(
          interests.map(async (interest) => {
            const response = await axios.get(`http://localhost:4000/products/${interest.productID}`);
            return { productID: interest.productID, ...response.data };
          })
        );
        const productDetailsMap = productDetailsData.reduce((acc, product) => {
          acc[product.productID] = product;
          return acc;
        }, {});
        setProductDetails(productDetailsMap);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (interests.length > 0) {
      fetchProductDetails();
    }
  }, [interests]);

  const handleRemoveInterest = async (productID) => {
    try {
      await axios.post('http://localhost:4000/deleteInterest', { userID: user.userDetails.userID, productID: productID });
      setInterests(interests.filter(item => item.productID !== productID));
    } catch (error) {
      console.error('Error removing interest:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Interested Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {interests.map((interest) => (
            <div key={interest._id} className="bg-white rounded-lg shadow-md p-4">
              {productDetails[interest.productID] && (
                <div className="mt-4">
                  <p className="text-lg font-bold">{productDetails[interest.productID][0].name}</p>
                  <p>Type: {productDetails[interest.productID][0].type}</p>
                  <p>Price: {productDetails[interest.productID][0].price}</p>
                  <p>Area: {productDetails[interest.productID][0].area}</p>
                  <p>City: {productDetails[interest.productID][0].city}</p>
                  <p>State: {productDetails[interest.productID][0].state}</p>
                  <p>Dimension: {productDetails[interest.productID][0].dimension}</p>
                  <p>Description: {productDetails[interest.productID][0].description}</p>
                </div>
              )}
              <button onClick={() => handleRemoveInterest(interest.productID)} className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Remove Interest</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Interest;
