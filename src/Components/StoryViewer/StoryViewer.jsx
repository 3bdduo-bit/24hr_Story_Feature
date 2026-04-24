import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiX, FiTrash2, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './StoryViewer.css';

const STORY_DURATION = 5000; // 5s per story

export default function StoryViewer({ stories, startIndex = 0, onClose, onDelete, markSeen, getTimeLeft, getProgress }) {
  const [current, setCurrent] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const pausedAtRef = useRef(0);

  const story = stories[current];

  useEffect(() => {
    if (story) markSeen(story.id);
  }, [current, story, markSeen]);

  const goNext = useCallback(() => {
    if (current < stories.length - 1) {
      setCurrent(c => c + 1);
      setElapsed(0);
      startTimeRef.current = Date.now();
      pausedAtRef.current = 0;
    } else {
      onClose();
    }
  }, [current, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setCurrent(c => c - 1);
      setElapsed(0);
      startTimeRef.current = Date.now();
      pausedAtRef.current = 0;
    }
  }, [current]);

  // Timer
  useEffect(() => {
    setElapsed(0);
    startTimeRef.current = Date.now();
    pausedAtRef.current = 0;
    setPaused(false);
  }, [current]);

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      pausedAtRef.current = elapsed;
      return;
    }
    startTimeRef.current = Date.now() - pausedAtRef.current;
    intervalRef.current = setInterval(() => {
      const e = Date.now() - startTimeRef.current;
      setElapsed(e);
      if (e >= STORY_DURATION) goNext();
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, [paused, goNext]);

  // Touch / swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(false);
    setDragX(0);
    setPaused(true);
  };
  const handleTouchMove = (e) => {
    if (touchStart === null) return;
    const dx = e.touches[0].clientX - touchStart;
    setDragX(dx);
    setIsDragging(Math.abs(dx) > 10);
  };
  const handleTouchEnd = () => {
    if (isDragging) {
      if (dragX < -60) goNext();
      else if (dragX > 60) goPrev();
    } else {
      setPaused(false);
    }
    setTouchStart(null);
    setDragX(0);
    setIsDragging(false);
    setPaused(false);
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, onClose]);

  if (!story) return null;
  const progressPct = Math.min((elapsed / STORY_DURATION) * 100, 100);
  const timeLeft = getTimeLeft(story.createdAt);
  const expiryProgress = getProgress(story.createdAt);

  return (
    <div className="sv-overlay" onClick={onClose}>
      <div
        className="sv-container"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${dragX * 0.3}px)` }}
      >
        {/* Progress bars */}
        <div className="sv-progress-bars">
          {stories.map((s, i) => (
            <div key={s.id} className="sv-progress-track">
              <div
                className="sv-progress-fill"
                style={{
                  width: i < current ? '100%' : i === current ? `${progressPct}%` : '0%',
                  transition: i === current ? 'none' : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="sv-header">
          <div className="sv-user-info">
            <div className="sv-avatar-ring" style={{ background: `conic-gradient(transparent ${expiryProgress * 360}deg, #a855f7 ${expiryProgress * 360}deg)` }}>
              <div className="sv-avatar-inner">
                <img src={story.image} alt="" className="sv-avatar-img" />
              </div>
            </div>
            <div className="sv-meta">
              <span className="sv-username">My Story</span>
              <span className="sv-time"><FiClock size={11} /> {timeLeft} left</span>
            </div>
          </div>
          <div className="sv-actions">
            <button className="sv-btn sv-delete" onClick={() => { onDelete(story.id); if (stories.length <= 1) onClose(); else goNext(); }} title="Delete story">
              <FiTrash2 size={18} />
            </button>
            <button className="sv-btn sv-close" onClick={onClose} title="Close">
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="sv-image-wrap" onMouseDown={() => setPaused(true)} onMouseUp={() => setPaused(false)}>
          <img src={story.image} alt="Story" className="sv-image" draggable={false} />
          {story.caption && <div className="sv-caption">{story.caption}</div>}
        </div>

        {/* Nav arrows */}
        {current > 0 && (
          <button className="sv-nav sv-nav-left" onClick={goPrev} aria-label="Previous story">
            <FiChevronLeft size={28} />
          </button>
        )}
        {current < stories.length - 1 && (
          <button className="sv-nav sv-nav-right" onClick={goNext} aria-label="Next story">
            <FiChevronRight size={28} />
          </button>
        )}

        {/* Story counter */}
        <div className="sv-counter">{current + 1} / {stories.length}</div>
      </div>
    </div>
  );
}
