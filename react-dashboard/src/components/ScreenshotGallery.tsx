import React, { useState } from 'react';
import { Screenshot } from '../types';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  currentScreenshot: Screenshot | null;
  onScreenshotSelect: (screenshot: Screenshot) => void;
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({
  screenshots,
  currentScreenshot,
  onScreenshotSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string>('');

  const openModal = (imageSrc: string) => {
    setModalImage(`http://localhost:8080/screenshots/${imageSrc}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-macos-border/30">
        <div className="flex items-center justify-between">
          <h2 className="text-macos-text text-lg font-semibold">Screenshots</h2>
          <div className="flex items-center space-x-2">
            <span className="text-macos-text-secondary text-sm">{screenshots.length}</span>
            <div className="w-6 h-6 bg-macos-card rounded-md flex items-center justify-center">
              <span className="text-macos-text-secondary text-xs">📷</span>
            </div>
          </div>
        </div>
        <p className="text-macos-text-secondary text-sm mt-1">Live captures from screen</p>
      </div>

      {/* Current Screenshot Display */}
      <div className="flex-1 p-6">
        {currentScreenshot ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 bg-macos-bg/50 rounded-macos-lg overflow-hidden shadow-macos-inner relative group">
              <img
                src={`http://localhost:8080/screenshots/${currentScreenshot.filename}`}
                alt={`Screenshot #${currentScreenshot.num}`}
                className="w-full h-full object-contain cursor-pointer transition-all duration-300 group-hover:scale-105"
                onClick={() => openModal(currentScreenshot.filename)}
              />

              {/* Screenshot Overlay Info */}
              <div className="absolute top-4 left-4 bg-macos-surface/90 backdrop-blur-macos px-3 py-2 rounded-lg shadow-macos-button">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-macos-green rounded-full animate-pulse-macos"></div>
                  <span className="text-macos-text text-sm font-medium">#{currentScreenshot.num}</span>
                </div>
                <div className="text-macos-text-secondary text-xs mt-1 font-sf-mono">
                  {currentScreenshot.timestamp} • {currentScreenshot.size_kb.toFixed(1)}KB
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Screenshot Thumbnails */}
            {screenshots.length > 1 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-macos-text-secondary text-sm">Recent Captures</span>
                  <span className="text-macos-text-secondary text-xs font-sf-mono">{screenshots.length - 1} more</span>
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {screenshots.slice(1, 6).map((screenshot, index) => (
                    <div
                      key={screenshot.num}
                      onClick={() => onScreenshotSelect(screenshot)}
                      className={`
                        min-w-[60px] h-[45px] rounded-md cursor-pointer transition-all duration-200 border-2 overflow-hidden
                        ${currentScreenshot?.num === screenshot.num
                          ? 'border-macos-blue shadow-macos-button'
                          : 'border-transparent hover:border-macos-blue/50 hover:scale-105'
                        }
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <img
                        src={`http://localhost:8080/screenshots/${screenshot.filename}`}
                        alt={`Screenshot #${screenshot.num}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-macos-card/50 rounded-macos-lg flex items-center justify-center mb-6 animate-scale-in">
              <span className="text-macos-text-secondary text-3xl">📷</span>
            </div>
            <h3 className="text-macos-text font-semibold text-lg mb-2">Waiting for Screenshots</h3>
            <p className="text-macos-text-secondary text-sm leading-relaxed">
              Click the <span className="text-macos-green font-medium">"Start"</span> button to begin<br />
              capturing and analyzing your screen in real-time
            </p>
          </div>
        )}
      </div>

      {/* Modal for enlarged screenshots */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-macos-heavy flex items-center justify-center z-50 animate-fade-in"
          onClick={closeModal}
        >
          <div className="relative max-w-[90%] max-h-[90%] animate-scale-in">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-10 h-10 bg-macos-surface/80 backdrop-blur-macos rounded-full flex items-center justify-center text-macos-text hover:bg-macos-card transition-all duration-200 shadow-macos-button"
            >
              <span className="text-lg">×</span>
            </button>
            <img
              src={modalImage}
              alt="Enlarged Screenshot"
              className="max-w-full max-h-full object-contain rounded-macos-lg shadow-macos-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotGallery;