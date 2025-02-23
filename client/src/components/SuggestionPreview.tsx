import React from 'react';
import { z } from 'zod';

interface SuggestionPreviewProps {
  section: string;
  suggestion: any;
}

const SuggestionPreview: React.FC<SuggestionPreviewProps> = ({ section, suggestion }) => {
  const renderExperience = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Experience Suggestion</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Description</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{suggestion.description}</p>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Key Achievements</h4>
          <ul className="list-disc list-inside space-y-1">
            {suggestion.achievements.map((achievement: string, index: number) => (
              <li key={index} className="text-gray-700">{achievement}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {suggestion.keywords.map((keyword: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-md">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Education Suggestion</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Description</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{suggestion.description}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Highlights</h4>
          <ul className="list-disc list-inside space-y-1">
            {suggestion.highlights.map((highlight: string, index: number) => (
              <li key={index} className="text-gray-700">{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Skills Suggestion</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Suggested Skills</h4>
          <div className="flex flex-wrap gap-2">
            {suggestion.skills.map((skill: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-green-50 text-green-600 text-sm rounded-md">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {suggestion.categories.map((category: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-purple-50 text-purple-600 text-sm rounded-md">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Summary Suggestion</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Professional Summary</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{suggestion.summary}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {suggestion.keywords.map((keyword: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-md">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (section) {
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'summary':
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      {renderContent()}
    </div>
  );
};

export default SuggestionPreview;