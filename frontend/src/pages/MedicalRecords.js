import React, { useState, useEffect } from 'react';
import { recordsAPI, filesAPI } from '../services/api';
import { 
  FileText, 
  Plus, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Tag,
  Shield,
  ShieldCheck,
  X,
  Download
} from 'lucide-react';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    type: 'prescription',
    title: '',
    description: '',
    date_of_visit: '',
    tags: [],
    visibility: 'private',
    files: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    type: '',
    search: ''
  });

  const recordTypes = [
    { value: 'prescription', label: 'Prescription' },
    { value: 'report', label: 'Lab Report' },
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadRecords();
  }, [filters]);

  const loadRecords = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.search) params.q = filters.search;
      
      const response = await recordsAPI.getRecords(params);
      setRecords(response.data.data);
    } catch (error) {
      console.error('Error loading records:', error);
      setMessage({ type: 'error', text: 'Failed to load medical records' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return [];

    setUploading(true);
    const uploadedFiles = [];

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await filesAPI.uploadFile(formData);
        uploadedFiles.push({
          file_id: response.data.id,
          url: response.data.url,
          filename: response.data.filename,
          mime: response.data.mime,
          size: response.data.size
        });
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setMessage({ type: 'error', text: 'Failed to upload some files' });
    } finally {
      setUploading(false);
    }

    return uploadedFiles;
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const openModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        type: record.type,
        title: record.title || '',
        description: record.description || '',
        date_of_visit: record.date_of_visit ? new Date(record.date_of_visit).toISOString().split('T')[0] : '',
        tags: record.tags || [],
        visibility: record.visibility,
        files: record.files || []
      });
    } else {
      setEditingRecord(null);
      setFormData({
        type: 'prescription',
        title: '',
        description: '',
        date_of_visit: new Date().toISOString().split('T')[0],
        tags: [],
        visibility: 'private',
        files: []
      });
    }
    setSelectedFiles([]);
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRecord(null);
    setSelectedFiles([]);
    setNewTag('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload new files if any
      const uploadedFiles = await uploadFiles();
      
      const recordData = {
        ...formData,
        files: [...formData.files, ...uploadedFiles]
      };

      if (editingRecord) {
        await recordsAPI.updateRecord(editingRecord._id, recordData);
        setMessage({ type: 'success', text: 'Record updated successfully!' });
      } else {
        await recordsAPI.createRecord(recordData);
        setMessage({ type: 'success', text: 'Record created successfully!' });
      }

      await loadRecords();
      closeModal();
    } catch (error) {
      console.error('Error saving record:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save record' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await recordsAPI.deleteRecord(recordId);
      setMessage({ type: 'success', text: 'Record deleted successfully!' });
      await loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to delete record' 
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTypeColor = (type) => {
    const colors = {
      prescription: 'bg-blue-100 text-blue-800',
      report: 'bg-green-100 text-green-800',
      diagnosis: 'bg-red-100 text-red-800',
      treatment: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
            <p className="text-gray-600">Manage your medical documents and health records</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search records..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                {recordTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-6">
          {records.length > 0 ? (
            records.map((record) => (
              <div key={record._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {record.title || `${record.type} Record`}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(record.type)}`}>
                          {recordTypes.find(t => t.value === record.type)?.label || record.type}
                        </span>
                        {record.verified_by_provider && (
                          <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            <ShieldCheck className="h-3 w-3 inline mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(record.date_of_visit)}
                        <Shield className="h-4 w-4 ml-4 mr-1" />
                        {record.visibility}
                      </div>

                      {record.description && (
                        <p className="text-gray-700 mb-3">{record.description}</p>
                      )}

                      {record.tags && record.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {record.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {record.files && record.files.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h4>
                          <div className="space-y-1">
                            {record.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  <Upload className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-900">{file.filename}</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({formatFileSize(file.size)})
                                  </span>
                                </div>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:text-primary-700"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openModal(record)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
              <p className="text-gray-500 mb-4">
                {filters.search || filters.type 
                  ? 'Try adjusting your search filters'
                  : 'Start by adding your first medical record'
                }
              </p>
              {!filters.search && !filters.type && (
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Record
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      {recordTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Visit
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_visit}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_of_visit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a title for this record"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="Describe the medical record, symptoms, treatment, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="private">Private</option>
                    <option value="shared">Shared</option>
                    <option value="public_emergency">Emergency Public</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Files
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Selected files:</p>
                      <ul className="text-sm text-gray-800 space-y-1">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="flex items-center">
                            <Upload className="h-4 w-4 text-gray-400 mr-2" />
                            {file.name} ({formatFileSize(file.size)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      saving || uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {saving ? 'Saving...' : uploading ? 'Uploading...' : editingRecord ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
