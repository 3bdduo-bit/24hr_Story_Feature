import React, { useRef } from 'react';
import { FiPlus, FiClock } from 'react-icons/fi';
import './StoryReel.css';

export default function StoryReel({ stories, onAddClick, onStoryClick, getTimeLeft, getProgress }) {
  const reelRef = useRef();

  // Swipe scroll on touch
  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      reelRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <section className="reel-section" aria-label="Story reel">
      <div className="reel-track" ref={reelRef} onWheel={handleWheel}>
        {/* Add story button */}
        <button className="reel-add-btn" onClick={onAddClick} id="add-story-button" aria-label="Add new story">
          <div className="reel-add-circle">
            <div className="reel-add-gradient-ring" />
            <div className="reel-add-inner">
              <FiPlus size={28} />
            </div>
          </div>
          <span className="reel-label">Your Story</span>
        </button>

        {/* Story bubbles */}
        {stories.map((story, index) => {
          const progress = getProgress(story.createdAt);
          const dashCircumference = 220;
          const dashOffset = progress * dashCircumference;
          const timeLeft = getTimeLeft(story.createdAt);

          return (
            <button
              key={story.id}
              className={`reel-story-btn ${story.seen ? 'reel-seen' : ''}`}
              onClick={() => onStoryClick(index)}
              id={`story-item-${story.id}`}
              aria-label={`View story, ${timeLeft} left`}
            >
              <div className="reel-story-circle">
                {/* SVG ring showing time remaining */}
                <svg className="reel-ring-svg" viewBox="0 0 80 80">
                  <circle className="reel-ring-bg" cx="40" cy="40" r="35" />
                  <circle
                    className={`reel-ring-fill ${story.seen ? 'reel-ring-seen' : ''}`}
                    cx="40" cy="40" r="35"
                    strokeDasharray={dashCircumference}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <div className="reel-story-img-wrap">
                  <img
                    src={story.image}
                    alt="Story thumbnail"
                    className="reel-story-img"
                    loading="lazy"
                  />
                  {!story.seen && <div className="reel-unseen-dot" />}
                </div>
              </div>
              <span className="reel-label reel-time-label">
                <FiClock size={10} /> {timeLeft}
              </span>
            </button>
          );
        })}

        {stories.length === 0 && (
          <div className="reel-empty-hint">
            <span>No stories yet — be the first!</span>
          </div>
        )}
      </div>
    </section>
  );
}
