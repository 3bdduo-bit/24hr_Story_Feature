import React, { useState } from 'react';
import { FiZap, FiTrash2, FiClock, FiGrid, FiList } from 'react-icons/fi';
import StoryReel from '../StoryReel/StoryReel';
import StoryViewer from '../StoryViewer/StoryViewer';
import UploadModal from '../UploadModal/UploadModal';
import { useStories } from '../../hooks/useStories';
import './Feed.css';

export default function Feed() {
  const { stories, addStory, markSeen, deleteStory, getTimeLeft, getProgress } = useStories();
  const [viewerIndex, setViewerIndex] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid | list

  const handleUpload = (base64, caption) => {
    addStory(base64, caption);
  };

  const handleStoryClick = (index) => {
    setViewerIndex(index);
  };

  return (
    <div className="feed-root">
      {/* Ambient background orbs */}
      <div className="feed-bg">
        <div className="feed-orb feed-orb-1" />
        <div className="feed-orb feed-orb-2" />
        <div className="feed-orb feed-orb-3" />
      </div>

      {/* Header */}
      <header className="feed-header" role="banner">
        <div className="feed-header-inner">
          <div className="feed-brand">
            <div className="feed-brand-icon"><FiZap size={20} /></div>
            <div>
              <h1 className="feed-brand-name">FlashStories</h1>
              <p className="feed-brand-sub">Moments that matter · 24h</p>
            </div>
          </div>
          <div className="feed-header-actions">
            <button
              className={`feed-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              <FiGrid size={18} />
            </button>
            <button
              className={`feed-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              <FiList size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Story Reel */}
      <div className="feed-reel-wrap">
        <StoryReel
          stories={stories}
          onAddClick={() => setShowUpload(true)}
          onStoryClick={handleStoryClick}
          getTimeLeft={getTimeLeft}
          getProgress={getProgress}
        />
      </div>

      {/* Divider */}
      <div className="feed-divider">
        <span className="feed-divider-label">
          {stories.length > 0 ? `${stories.length} active ${stories.length === 1 ? 'story' : 'stories'}` : 'No stories yet'}
        </span>
      </div>

      {/* Main Grid / List */}
      <main className="feed-main" role="main">
        {stories.length === 0 ? (
          <div className="feed-empty">
            <div className="feed-empty-icon">
              <FiZap size={48} />
            </div>
            <h2 className="feed-empty-title">Start your first story</h2>
            <p className="feed-empty-sub">Share a photo that disappears in 24 hours.</p>
            <button className="feed-empty-cta" onClick={() => setShowUpload(true)} id="empty-add-story-btn">
              Share a moment
            </button>
          </div>
        ) : (
          <div className={`feed-grid ${viewMode === 'list' ? 'feed-list' : ''}`}>
            {stories.map((story, index) => {
              const timeLeft = getTimeLeft(story.createdAt);
              const progress = getProgress(story.createdAt);
              const urgency = progress > 0.85;

              return (
                <article
                  key={story.id}
                  className={`feed-card ${story.seen ? 'feed-card-seen' : ''} ${urgency ? 'feed-card-urgent' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className="feed-card-img-wrap"
                    onClick={() => handleStoryClick(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleStoryClick(index)}
                    aria-label={`View story ${index + 1}`}
                  >
                    <img src={story.image} alt={story.caption || 'Story'} className="feed-card-img" loading="lazy" />
                    <div className="feed-card-overlay">
                      <div className="feed-card-overlay-content">
                        {!story.seen && <span className="feed-new-badge">NEW</span>}
                        {story.caption && <p className="feed-card-caption">{story.caption}</p>}
                      </div>
                    </div>
                    {/* Expiry bar */}
                    <div className="feed-expiry-bar">
                      <div
                        className={`feed-expiry-fill ${urgency ? 'feed-expiry-urgent' : ''}`}
                        style={{ width: `${(1 - progress) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="feed-card-footer">
                    <div className="feed-card-time">
                      <FiClock size={12} />
                      <span className={urgency ? 'feed-time-urgent' : ''}>{timeLeft} left</span>
                    </div>
                    <button
                      className="feed-card-delete"
                      onClick={() => deleteStory(story.id)}
                      title="Delete story"
                      aria-label="Delete story"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}
      {viewerIndex !== null && stories.length > 0 && (
        <StoryViewer
          stories={stories}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onDelete={deleteStory}
          markSeen={markSeen}
          getTimeLeft={getTimeLeft}
          getProgress={getProgress}
        />
      )}
    </div>
  );
}
