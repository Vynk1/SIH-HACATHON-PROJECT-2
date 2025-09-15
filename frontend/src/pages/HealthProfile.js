import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Heart, Phone, Save, Plus, X, AlertTriangle } from 'lucide-react';

const HealthProfile = () => {
  const [profile, setProfile] = useState({
    dob: '',
    gender: '',
    blood_group: '',
    weight_kg: '',
    height_cm: '',
    allergies: [],
    chronic_conditions: [],
    medications: [],
    emergency_contacts: [],
    primary_physician: { name: '', phone: '', provider_id: '' },
    public_emergency_summary: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '', notes: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getMyProfile();
      if (response.data.profile) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePhysicianChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      primary_physician: { ...prev.primary_physician, [field]: value }
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setProfile(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setProfile(prev => ({
        ...prev,
        chronic_conditions: [...prev.chronic_conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index) => {
    setProfile(prev => ({
      ...prev,
      chronic_conditions: prev.chronic_conditions.filter((_, i) => i !== index)
    }));
  };

  const addMedication = () => {
    if (newMedication.name.trim()) {
      setProfile(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication]
      }));
      setNewMedication({ name: '', dosage: '', frequency: '' });
    }
  };

  const removeMedication = (index) => {
    setProfile(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setProfile(prev => ({
        ...prev,
        emergency_contacts: [...prev.emergency_contacts, newContact]
      }));
      setNewContact({ name: '', relation: '', phone: '', notes: '' });
    }
  };

  const removeContact = (index) => {
    setProfile(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.updateHealthProfile(profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Health Profile</h1>
          <p className="text-muted-foreground text-lg">
            Manage your health information and emergency details
          </p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-md border ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-destructive/15 text-destructive border-destructive/20'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your personal health details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                <input
                  type="date"
                  value={profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  value={profile.blood_group}
                  onChange={(e) => handleInputChange('blood_group', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={profile.weight_kg}
                  onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter weight in kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={profile.height_cm}
                  onChange={(e) => handleInputChange('height_cm', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter height in cm"
                />
              </div>
            </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>Allergies, conditions, and medications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>

            {/* Allergies */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add an allergy"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                />
                <Button
                  type="button"
                  onClick={addAllergy}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((allergy, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chronic Conditions
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Add a chronic condition"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                />
                <Button
                  type="button"
                  onClick={addCondition}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.chronic_conditions.map((condition, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Medication name"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="Dosage"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  placeholder="Frequency"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  type="button"
                  onClick={addMedication}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {profile.medications.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                    <div>
                      <span className="font-medium text-blue-900">{med.name}</span>
                      {(med.dosage || med.frequency) && (
                        <span className="text-blue-700 text-sm ml-2">
                          {med.dosage} {med.frequency}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>People to contact in case of emergency</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Contact name"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                value={newContact.relation}
                onChange={(e) => setNewContact(prev => ({ ...prev, relation: e.target.value }))}
                placeholder="Relationship"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                value={newContact.notes}
                onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button
                type="button"
                onClick={addContact}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {profile.emergency_contacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-green-900">{contact.name}</span>
                      {contact.relation && (
                        <span className="text-green-700 text-sm ml-2">({contact.relation})</span>
                      )}
                    </div>
                    <div className="text-green-800 text-sm">
                      {contact.phone}
                      {contact.notes && <span className="ml-2">• {contact.notes}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>

          {/* Primary Physician */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Primary Physician</CardTitle>
                  <CardDescription>Your main healthcare provider</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physician Name
                </label>
                <input
                  type="text"
                  value={profile.primary_physician.name}
                  onChange={(e) => handlePhysicianChange('name', e.target.value)}
                  placeholder="Dr. Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.primary_physician.phone}
                  onChange={(e) => handlePhysicianChange('phone', e.target.value)}
                  placeholder="Phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            </CardContent>
          </Card>

          {/* Emergency Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Public Emergency Summary</CardTitle>
              <CardDescription>
                This information will be visible to emergency responders when they scan your QR code.
              </CardDescription>
            </CardHeader>
            <CardContent>
            <textarea
              value={profile.public_emergency_summary}
              onChange={(e) => handleInputChange('public_emergency_summary', e.target.value)}
              placeholder="Brief summary of critical medical information for emergency responders..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              size="lg"
              className="min-w-[150px]"
            >
              <Save className="h-5 w-5 mr-2" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthProfile;
