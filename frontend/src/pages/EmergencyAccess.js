import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { 
  Heart, 
  User, 
  Phone, 
  AlertTriangle, 
  Clock, 
  MapPin,
  Shield,
  Activity
} from 'lucide-react';

const EmergencyAccess = () => {
  const { publicId } = useParams();
  const [emergencyData, setEmergencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (publicId) {
      loadEmergencyData();
    } else {
      setError('Invalid emergency ID');
      setLoading(false);
    }
  }, [publicId]);

  const loadEmergencyData = async () => {
    try {
      const response = await publicAPI.getEmergencyData(publicId);
      setEmergencyData(response.data);
    } catch (err) {
      console.error('Error loading emergency data:', err);
      setError(err.response?.data?.message || 'Failed to load emergency information');
    } finally {
      setLoading(false);
    }
  };

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800 border-red-200',
      'A-': 'bg-red-100 text-red-800 border-red-200',
      'B+': 'bg-blue-100 text-blue-800 border-blue-200',
      'B-': 'bg-blue-100 text-blue-800 border-blue-200',
      'AB+': 'bg-purple-100 text-purple-800 border-purple-200',
      'AB-': 'bg-purple-100 text-purple-800 border-purple-200',
      'O+': 'bg-green-100 text-green-800 border-green-200',
      'O-': 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[bloodGroup] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="animate-pulse text-center">
            <div className="h-12 w-12 bg-red-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <Heart className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">EMERGENCY MEDICAL INFORMATION</h1>
              <p className="text-red-100">Accessed: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Patient Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <div className="text-lg font-semibold text-gray-900">{emergencyData.name}</div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Age</label>
                <div className="text-lg text-gray-900">
                  {emergencyData.age ? `${emergencyData.age} years` : 'Not specified'}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Blood Group</label>
                {emergencyData.blood_group ? (
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold border-2 ${getBloodGroupColor(emergencyData.blood_group)}`}>
                    {emergencyData.blood_group}
                  </span>
                ) : (
                  <div className="text-lg text-gray-500">Not specified</div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Emergency ID</label>
                <div className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {emergencyData.public_id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Medical Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Allergies */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Allergies</h2>
            </div>
            
            {emergencyData.allergies && emergencyData.allergies.length > 0 ? (
              <div className="space-y-2">
                {emergencyData.allergies.map((allergy, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-red-800 font-semibold">{allergy}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 bg-gray-50 p-4 rounded-lg">
                No known allergies reported
              </div>
            )}
          </div>

          {/* Chronic Conditions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Activity className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Chronic Conditions</h2>
            </div>
            
            {emergencyData.chronic_conditions && emergencyData.chronic_conditions.length > 0 ? (
              <div className="space-y-2">
                {emergencyData.chronic_conditions.map((condition, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-orange-800 font-semibold">{condition}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 bg-gray-50 p-4 rounded-lg">
                No chronic conditions reported
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Phone className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
          </div>
          
          {emergencyData.emergency_contacts && emergencyData.emergency_contacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyData.emergency_contacts.map((contact, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-900 font-semibold text-lg">{contact.name}</div>
                  {contact.relation && (
                    <div className="text-green-700 text-sm mb-2">{contact.relation}</div>
                  )}
                  <div className="text-green-800 font-mono text-lg">
                    <a href={`tel:${contact.phone}`} className="hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                  {contact.notes && (
                    <div className="text-green-700 text-sm mt-2">{contact.notes}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 bg-gray-50 p-4 rounded-lg">
              No emergency contacts available
            </div>
          )}
        </div>

        {/* Additional Notes */}
        {emergencyData.note && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Emergency Summary</h2>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-lg leading-relaxed">{emergencyData.note}</p>
            </div>
          </div>
        )}

        {/* Footer Information */}
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <div className="text-gray-600">
            <Clock className="h-4 w-4 inline mr-2" />
            This information is provided for emergency medical purposes only.
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Digital Health Card System - Emergency Access Log Recorded
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccess;
