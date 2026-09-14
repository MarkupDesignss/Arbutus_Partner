import React, { useState, useEffect, useRef } from "react";
import { useGetMediaQuery } from "../../Redux/api/publicApiSlice";
import { Play, X, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";

export default function VideoSlider() {
  const { data, isLoading } = useGetMediaQuery();

  // Extract videos from the response
  const videos = data?.data?.map((item) => ({
    id: item.id,
    title: item.title,
    src: item.video_path,
    thumbnail: item.thumbnail_path,
    status: item.status,
    createdAt: item.created_at,
  })) || [];

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const modalVideoRef = useRef(null);
  const scrollRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isModalOpen || videos.length === 0) return;

    let scrollPos = 0;
    const interval = setInterval(() => {
      if (container.scrollWidth > container.clientWidth) {
        scrollPos += 1;
        // Stop at the end of the actual content
        if (scrollPos >= container.scrollWidth - container.clientWidth) {
          scrollPos = 0;
        }
        container.scrollLeft = scrollPos;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isModalOpen, videos]);

  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => { });
    }
  }, [isModalOpen, selectedVideo]);
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
    setIsFullscreen(false);
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }
    setSelectedVideo(null);
  };

  // Toggle mute
  const toggleMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);

    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current.play().catch(() => { });
      }
    }, 100);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="mb-8">
          <h1 className="text-4xl roboto-bold text-[#4A4A4A] inline-block">Media</h1>
          <div className="mt-2 h-[1px] w-full bg-[#D4D7DC]"></div>
          <div className="h-0.5 w-20 bg-[#2A57C4] rounded-full"></div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A57C4]"></div>
        </div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="mb-8">
          <h1 className="text-4xl roboto-bold text-[#4A4A4A] inline-block">Media</h1>
          <div className="mt-2 h-[1px] w-full bg-[#D4D7DC]"></div>
          <div className="h-0.5 w-20 bg-[#2A57C4] rounded-full"></div>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No videos available</p>
        </div>
      </div>
    );
  }

  // Show only the actual videos from backend (no duplication)
  return (
    <div className="max-w-7xl mx-auto px-4 mb-5">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl roboto-bold text-[#4A4A4A] inline-block">
          Media
        </h1>
        <div className="mt-2 h-[1px] w-full bg-[#D4D7DC]"></div>
        <div className="h-0.5 w-20 bg-[#2A57C4] rounded-full"></div>
      </div>


      {/* Slider - Only show actual videos from backend */}
      <div className="overflow-hidden relative">
        {videos.length > 0 && (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {videos.map((video, index) => {
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={video.id}
                  className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl flex-shrink-0 transition-all duration-300 cursor-pointer"
                  style={{ height: "300px", width: "420px" }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Thumbnail */}
                  <video
                    src={video.src}
                    poster={video.thumbnail}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"
                      }`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Video Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-white/60 text-xs mt-1">
                      {formatDate(video.createdAt)}
                    </p>
                  </div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                    <button
                      onClick={() => handlePlayVideo(video)}
                      className="relative z-20"
                    >
                      <div className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-md cursor-pointer flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#2A57C4] flex items-center justify-center">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Status Badge */}
                  {video.status === '1' && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        New
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg truncate">
                  {selectedVideo.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {formatDate(selectedVideo.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-colors"
                  aria-label="Close video"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <video
                ref={modalVideoRef}
                src={selectedVideo.src}
                poster={selectedVideo.thumbnail}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                controls
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onLoadedMetadata={(e) => {
                  e.currentTarget.play().catch(() => { });
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>

              {/* Custom Play/Pause Overlay (optional) */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-10 h-10 text-white fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Video Info Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between text-white/70 text-sm">
                <span>Click to play/pause</span>
                <span>Press ESC to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}