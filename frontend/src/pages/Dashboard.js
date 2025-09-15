import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, recordsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Heart, 
  User, 
  FileText, 
  QrCode, 
  Calendar,
  Activity,
  AlertCircle,
  Plus,
  ArrowRight
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
      console.log('Profile response:', profileRes.data);
      setProfile(profileRes.data.profile);
      
      // Load recent records
      const recordsRes = await recordsAPI.getRecords({ limit: 5 });
      console.log('Records response:', recordsRes.data);
      setRecentRecords(recordsRes.data.data);
      
      // Calculate stats with better data access
      const healthProfile = profileRes.data.profile;
      const emergencyContacts = healthProfile?.emergency_contacts || [];
      
      console.log('Health profile:', healthProfile);
      console.log('Emergency contacts:', emergencyContacts);
      
      setStats({
        totalRecords: recordsRes.data.meta.total,
        lastVisit: recordsRes.data.data[0]?.date_of_visit,
        emergencyContacts: emergencyContacts.length
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Welcome back, {user?.full_name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's an overview of your health information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Medical Records</p>
                  <p className="text-2xl font-bold">{stats.totalRecords}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                  <p className="text-lg font-bold">{formatDate(stats.lastVisit)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Emergency Contacts</p>
                  <p className="text-2xl font-bold">{stats.emergencyContacts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Profile Status</p>
                  <p className="text-lg font-bold">
                    {profile ? 'Complete' : 'Incomplete'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Quick Actions & Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Manage your health information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/records"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary mb-2" />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                    Add Record
                  </span>
                </Link>

                <Link
                  to="/profile"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <User className="h-8 w-8 text-muted-foreground group-hover:text-primary mb-2" />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                    Update Profile
                  </span>
                </Link>

                <Link
                  to="/qr"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <QrCode className="h-8 w-8 text-muted-foreground group-hover:text-primary mb-2" />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                    View QR Code
                  </span>
                </Link>

                <a
                  href={`/e/${profile?.public_emergency_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <Heart className="h-8 w-8 text-muted-foreground group-hover:text-primary mb-2" />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                    Emergency View
                  </span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Summary</CardTitle>
              <CardDescription>Your key health information</CardDescription>
            </CardHeader>
            <CardContent>
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
                <Button asChild>
                  <Link to="/profile">
                    Complete Profile
                  </Link>
                </Button>
              </div>
            )}
            </CardContent>
          </Card>
      </div>

      {/* Recent Records */}
      <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Medical Records</CardTitle>
                <CardDescription>Your latest health records</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/records" className="inline-flex items-center gap-2">
                  View all <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentRecords.length > 0 ? (
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div
                    key={record._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-primary/10 rounded-lg mr-4">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {record.title || `${record.type} Record`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
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
                          ? 'text-muted-foreground bg-muted'
                          : 'text-primary bg-primary/10'
                      }`}>
                        {record.visibility}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No medical records yet</h4>
                <p className="text-muted-foreground mb-4">Start by adding your first medical record</p>
                <Button asChild>
                  <Link to="/records">
                    Add First Record
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
