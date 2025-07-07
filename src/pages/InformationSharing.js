import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  BookOpen, 
  Video, 
  Image, 
  Link, 
  Calendar, 
  User, 
  Tag,
  Share2,
  Heart,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';
import resourcesData from '../data/resources.json';

/**
 * Information Sharing component for public resources and knowledge sharing
 * @returns {React.Component} Information Sharing page
 */
const InformationSharing = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Load resources data
  useEffect(() => {
    const loadResources = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        // Add default values for missing properties
        const resourcesWithDefaults = resourcesData.resources.map(resource => ({
          ...resource,
          downloads: resource.downloads || Math.floor(Math.random() * 1000) + 100,
          views: resource.views || Math.floor(Math.random() * 5000) + 500
        }));
        setResources(resourcesWithDefaults);
        
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('greenhub_favorites');
        if (savedFavorites) {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        }
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
      const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
      const matchesType = selectedType === 'all' || resource.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesLanguage && matchesType;
    });

    // Sort resources
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.published_date) - new Date(a.published_date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'downloads':
          return (b.downloads || 0) - (a.downloads || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [resources, searchTerm, selectedCategory, selectedLanguage, selectedType, sortBy]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    return {
      categories: [...new Set(resources.map(r => r.category))].sort(),
      languages: [...new Set(resources.map(r => r.language))].sort(),
      types: [...new Set(resources.map(r => r.type))].sort()
    };
  }, [resources]);

  /**
   * Toggle favorite status for a resource
   * @param {string} resourceId - Resource ID
   */
  const toggleFavorite = (resourceId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(resourceId)) {
      newFavorites.delete(resourceId);
    } else {
      newFavorites.add(resourceId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('greenhub_favorites', JSON.stringify([...newFavorites]));
  };

  /**
   * Get resource type icon
   * @param {string} type - Resource type
   * @returns {React.Component} Type icon
   */
  const getTypeIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'report':
        return <BookOpen className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'link':
        return <Link className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  /**
   * Get resource type color
   * @param {string} type - Resource type
   * @returns {string} Color class
   */
  const getTypeColor = (type) => {
    switch (type) {
      case 'document':
        return 'text-blue-600 bg-blue-100';
      case 'report':
        return 'text-green-600 bg-green-100';
      case 'video':
        return 'text-red-600 bg-red-100';
      case 'image':
        return 'text-purple-600 bg-purple-100';
      case 'link':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  /**
   * Handle resource download/view
   * @param {Object} resource - Resource object
   */
  const handleResourceAction = (resource) => {
    if (resource.type === 'link') {
      window.open(resource.url, '_blank');
    } else {
      // In a real app, this would trigger a download
      console.log('Downloading:', resource.title);
      // Simulate download
      const link = document.createElement('a');
      link.href = resource.url;
      link.download = resource.title;
      link.click();
    }
  };

  /**
   * Share resource
   * @param {Object} resource - Resource object
   */
  const shareResource = (resource) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: resource.url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(resource.url);
      alert('Resource link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Share2 className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Information Sharing</h1>
              <p className="text-gray-600 mt-1">
                Access climate adaptation resources, reports, and educational materials
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Total Resources</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">{resources.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Total Downloads</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {resources.reduce((sum, r) => sum + (r.downloads || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">Total Views</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {resources.reduce((sum, r) => sum + (r.views || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span className="text-sm text-gray-600">Favorites</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">{favorites.size}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources, documents, reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="downloads">Sort by Downloads</option>
                <option value="views">Sort by Views</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Languages</option>
                  {filterOptions.languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Types</option>
                  {filterOptions.types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedLanguage('all');
                    setSelectedType('all');
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </div>

        {/* Resources Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Resource Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                      {getTypeIcon(resource.type)}
                      <span className="capitalize">{resource.type}</span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(resource.id)}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        favorites.has(resource.id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(resource.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{resource.tags.length - 3} more</span>
                    )}
                  </div>
                  
                  {/* Metadata */}
                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{resource.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(resource.published_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{(resource.downloads || 0).toLocaleString()} downloads</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{(resource.views || 0).toLocaleString()} views</span>
                      </div>
                    </div>
                    {resource.file_size && (
                      <div className="text-gray-500">
                        Size: {formatFileSize(resource.file_size)}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleResourceAction(resource)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      {resource.type === 'link' ? (
                        <>
                          <ExternalLink className="h-4 w-4" />
                          <span>Visit</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => shareResource(resource)}
                      className="p-2 text-gray-600 hover:text-primary-600 border border-gray-300 rounded-lg hover:border-primary-300 transition-colors duration-200"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                      {getTypeIcon(resource.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {resource.title}
                          </h3>
                          <p className="text-gray-600 mb-2">{resource.description}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {resource.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          {/* Metadata */}
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{resource.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(resource.published_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Download className="h-4 w-4" />
                              <span>{(resource.downloads || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{(resource.views || 0).toLocaleString()}</span>
                            </div>
                            {resource.file_size && (
                              <span>{formatFileSize(resource.file_size)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => toggleFavorite(resource.id)}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              favorites.has(resource.id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${favorites.has(resource.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => shareResource(resource)}
                            className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleResourceAction(resource)}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                          >
                            {resource.type === 'link' ? (
                              <>
                                <ExternalLink className="h-4 w-4" />
                                <span>Visit</span>
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformationSharing;