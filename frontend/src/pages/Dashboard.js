import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, recordsAPI } from '../services/api';
import { 
  Heart, 
  User, 
  FileText, 
  QrCode, 
  Calendar,
  Activity,
  AlertCircle,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    lastVisit: null,
    emergencyContacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load user profile
      const profileRes = await userAPI.getMyProfile();
      setProfile(profileRes.data.profile);
      
      // Load recent records
      const recordsRes = await recordsAPI.getRecords({ limit: 5 });
      setRecentRecords(recordsRes.data.data);
      
      // Calculate stats
      setStats({
        totalRecords: recordsRes.data.meta.total,
        lastVisit: recordsRes.data.data[0]?.date_of_visit,
        emergencyContacts: profileRes.data.profile?.emergency_contacts?.length || 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  };

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-red-100 text-red-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-purple-100 text-purple-800',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-green-100 text-green-800',
    };
    return colors[bloodGroup] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your health information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Medical Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Visit</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(stats.lastVisit)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emergency Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emergencyContacts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {profile ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Health Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/records"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <Plus className="h-8 w-8 text-gray-400 group-hover:text-primary-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  Add Record
                </span>
              </Link>

              <Link
                to="/profile"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <User className="h-8 w-8 text-gray-400 group-hover:text-primary-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  Update Profile
                </span>
              </Link>

              <Link
                to="/qr"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <QrCode className="h-8 w-8 text-gray-400 group-hover:text-primary-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  View QR Code
                </span>
              </Link>

              <a
                href={`/e/${profile?.public_emergency_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <Heart className="h-8 w-8 text-gray-400 group-hover:text-primary-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  Emergency View
                </span>
              </a>
            </div>
          </div>

          {/* Health Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h3>
            {profile ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Blood Group</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBloodGroupColor(profile.blood_group)}`}>
                    {profile.blood_group || 'Not specified'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Age</span>
                  <span className="text-sm text-gray-900">
                    {profile.dob 
                      ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                      : 'Not specified'
                    } years
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Allergies</span>
                  <span className="text-sm text-gray-900">
                    {profile.allergies?.length || 0} listed
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Medications</span>
                  <span className="text-sm text-gray-900">
                    {profile.medications?.length || 0} current
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">Complete your health profile to see summary</p>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Complete Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Medical Records</h3>
              <Link
                to="/records"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          
          <div className="px-6 py-4">
            {recentRecords.length > 0 ? (
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div
                    key={record._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-4">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {record.title || `${record.type} Record`}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatDate(record.date_of_visit)} • {record.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {record.verified_by_provider && (
                        <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          Verified
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.visibility === 'private' 
                          ? 'text-gray-800 bg-gray-100'
                          : 'text-blue-800 bg-blue-100'
                      }`}>
                        {record.visibility}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No medical records yet</h4>
                <p className="text-gray-500 mb-4">Start by adding your first medical record</p>
                <Link
                  to="/records"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Add First Record
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
