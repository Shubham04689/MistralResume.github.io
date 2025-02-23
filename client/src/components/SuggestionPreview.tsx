import React from 'react';
import { z } from 'zod';
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface SuggestionPreviewProps {
  section: string;
  suggestion: any;
}

const SuggestionPreview: React.FC<SuggestionPreviewProps> = ({ section, suggestion }) => {
  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{title}</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
        {content}
      </div>
    </div>
  );

  const renderList = (items: string[]) => (
    <ul className="space-y-3">
      {items.slice(0, 3).map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start"
        >
          <span className="text-blue-500 mr-2">•</span>
          <span className="text-gray-700 flex-1">
            {item.length > 150 ? `${item.substring(0, 150)}...` : item}
          </span>
        </motion.li>
      ))}
    </ul>
  );

  const renderTags = (items: string[]) => (
    <div className="flex flex-wrap gap-2">
      {items.slice(0, 8).map((item, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
        >
          {item.length > 20 ? `${item.substring(0, 20)}...` : item}
        </motion.span>
      ))}
    </div>
  );

  const renderExperience = () => renderSection(
    'Experience Suggestions',
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">Career Highlights</h4>
        {renderList(suggestion.achievements?.slice(0, 3) || [])}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">Technical Skills</h4>
        {renderTags(suggestion.technologies || [])}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">Key Metrics</h4>
        <ul className="space-y-2">
          {suggestion.metrics?.slice(0, 2).map((metric, index) => (
            <li key={index} className="text-gray-700">
              → {metric}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderEducation = () => renderSection(
    'Education Suggestion',
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Description</h4>
        <p className="text-gray-700">{suggestion.description}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Highlights</h4>
        {renderList(suggestion.highlights)}
      </div>
    </div>
  );

  const renderSkills = () => renderSection(
    'Skills Suggestion',
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Suggested Skills</h4>
        {renderTags(suggestion.skills)}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Categories</h4>
        {renderTags(suggestion.categories)}
      </div>
    </div>
  );

  const renderSummary = () => renderSection(
    'Summary Suggestion',
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Professional Summary</h4>
        <p className="text-gray-700">{suggestion.summary}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Keywords</h4>
        {renderTags(suggestion.keywords)}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (section) {
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'summary': return renderSummary();
      default: return null;
    }
  };

  return (
    <ScrollArea className="h-[500px] w-full rounded-md border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 bg-gray-50 rounded-lg"
      >
        {renderContent()}
      </motion.div>
    </ScrollArea>
  );
};

export default SuggestionPreview;