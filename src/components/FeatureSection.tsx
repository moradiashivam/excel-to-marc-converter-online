
import React from 'react';
import { File, FileText, Upload, Download, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FeatureSection = () => {
  return (
    <section className="py-10 sm:py-16 bg-gradient-to-br from-blue-50/70 to-purple-50/70 dark:from-blue-900/30 dark:to-purple-900/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-3 sm:mb-4">
            Powerful MARC Conversion Features
          </h2>
          <div className="h-1 w-24 sm:w-32 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-4 sm:mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            Transform your Excel spreadsheets into standard MARC format with our advanced tools and features
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature Card 1 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
            <CardContent className="pt-6 pb-8 px-6">
              <div className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 mb-5 mx-auto">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">
                Easy Excel Upload
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">
                Simply drag and drop your Excel files for instant processing with automatic field mapping.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 2 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <CardContent className="pt-6 pb-8 px-6">
              <div className="rounded-full w-14 h-14 flex items-center justify-center bg-purple-100 dark:bg-purple-900/50 mb-5 mx-auto">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">
                Smart Validation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">
                Comprehensive error checking ensures your MARC records meet library standards.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 3 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-400"></div>
            <CardContent className="pt-6 pb-8 px-6">
              <div className="rounded-full w-14 h-14 flex items-center justify-center bg-green-100 dark:bg-green-900/50 mb-5 mx-auto">
                <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">
                Multiple Export Formats
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">
                Download your converted data in MARC21, MRK, or TXT formats with a single click.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 4 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber-400 to-yellow-400"></div>
            <CardContent className="pt-6 pb-8 px-6">
              <div className="rounded-full w-14 h-14 flex items-center justify-center bg-amber-100 dark:bg-amber-900/50 mb-5 mx-auto">
                <File className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">
                Bulk Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">
                Convert thousands of records simultaneously with our high-performance engine.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 5 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-400 to-pink-400"></div>
            <CardContent className="pt-6 pb-8 px-6">
              <div className="rounded-full w-14 h-14 flex items-center justify-center bg-red-100 dark:bg-red-900/50 mb-5 mx-auto">
                <ArrowDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">
                Duplicate Detection
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">
                Automatically identify and merge duplicate records to maintain catalog integrity.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 6 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-400 to-blue-400"></div>
            <CardContent className="pt-6 pb-8 px-6">
              <div className="rounded-full w-14 h-14 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 mb-5 mx-auto">
                <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">
                Customizable Options
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm sm:text-base">
                Fine-tune your conversion with advanced settings and field mappings.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
            Trusted by librarians and information professionals worldwide
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2">
            Built with modern web technologies for optimal performance
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
