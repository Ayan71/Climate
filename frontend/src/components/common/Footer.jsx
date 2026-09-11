import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-extrabold text-base">
              <Globe className="w-5 h-5 text-teal-400" />
              <span>Climate Energy Portal</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Open public platform for managing, verifying, and visualizing Climate, Energy, and Power datasets across India.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Domain Portals</h4>
            <ul className="space-y-2">
              <li><Link to="/climate" className="hover:text-teal-400 transition-colors">Climate Datasets</Link></li>
              <li><Link to="/energy" className="hover:text-teal-400 transition-colors">Energy & Renewables</Link></li>
              <li><Link to="/power" className="hover:text-teal-400 transition-colors">Power Grid & Demand</Link></li>
              <li><Link to="/" className="hover:text-teal-400 transition-colors">All Visualizations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Visualization Types</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Latitude / Longitude Map</li>
              <li>India State Choropleth Heatmap</li>
              <li>Time-Series Line Chart</li>
              <li>Time-Series Bar & Area Chart</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Vasudha India. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 md:mt-0">
            <span>Designed & Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Climate Research & Data Transparency.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
