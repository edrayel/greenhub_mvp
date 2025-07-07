import React from 'react';
import { Leaf, Users, Target, Globe, Award, Heart } from 'lucide-react';

/**
 * About page component providing information about GreenHub platform
 * @returns {React.Component} About page component
 */
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Leaf className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About GreenHub
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Nigeria's comprehensive platform for climate adaptation planning, 
              monitoring, and knowledge sharing.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To empower Nigeria's climate resilience through data-driven adaptation 
              planning, collaborative monitoring, and accessible knowledge sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Strategic Planning
              </h3>
              <p className="text-gray-600">
                Support evidence-based National Adaptation Plan development 
                and implementation across Nigeria.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Collaborative Approach
              </h3>
              <p className="text-gray-600">
                Foster collaboration between government agencies, researchers, 
                and communities for effective climate action.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Knowledge Sharing
              </h3>
              <p className="text-gray-600">
                Provide accessible climate information and resources 
                to support informed decision-making.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools for climate adaptation planning and monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Climate Database
              </h3>
              <p className="text-gray-600 text-sm">
                Access comprehensive climate data, projections, and analytics 
                for informed decision-making.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vulnerability Maps
              </h3>
              <p className="text-gray-600 text-sm">
                Interactive maps showing climate risks and vulnerability 
                assessments across Nigeria.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                M&E Dashboard
              </h3>
              <p className="text-gray-600 text-sm">
                Monitor and evaluate National Adaptation Plan 
                implementation progress and outcomes.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Resource Library
              </h3>
              <p className="text-gray-600 text-sm">
                Comprehensive collection of climate adaptation resources, 
                guides, and best practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600">
              Supporting Nigeria's climate resilience through data and collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">36</div>
              <div className="text-gray-600">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-gray-600">Climate Datasets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Adaptation Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">1000+</div>
              <div className="text-gray-600">Resources Shared</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Involved
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join Nigeria's climate adaptation community and contribute to 
            building a more resilient future.
          </p>
          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Federal Ministry of Environment</strong><br />
              Climate Change Department<br />
              Abuja, Nigeria
            </p>
            <p className="text-gray-300">
              Email: info@greenhub.gov.ng<br />
              Phone: +234 (0) 9 123 4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;