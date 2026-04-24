import React, { useState, useRef } from 'react';
import { FiX, FiImage, FiType, FiUploadCloud } from 'react-icons/fi';
import './UploadModal.css';

export default function UploadModal({ onClose, onUpload }) {
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be under 8MB.');
      return;
    }
    setError('');
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setLoading(false);
    };
    reader.onerror = () => { setError('Failed to read file.'); setLoading(false); };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handlePost = () => {
    if (!preview) return;
    onUpload(preview, caption.trim());
    onClose();
  };

  return (
    <div className="um-overlay" onClick={onClose}>
      <div className="um-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Upload story">
        <div className="um-header">
          <h2 className="um-title">New Story</h2>
          <button className="um-close" onClick={onClose} aria-label="Close modal"><FiX size={20} /></button>
        </div>

        {!preview ? (
          <div
            className={`um-dropzone ${dragging ? 'um-dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="story-file-input"
              onChange={e => processFile(e.target.files[0])}
            />
            <div className="um-dz-icon">
              {loading ? <div className="um-spinner" /> : <FiUploadCloud size={48} />}
            </div>
            <p className="um-dz-title">{loading ? 'Processing…' : 'Drop your photo here'}</p>
            <p className="um-dz-sub">or click to browse · Max 8MB</p>
            {error && <p className="um-error">{error}</p>}
          </div>
        ) : (
          <div className="um-preview-wrap">
            <div className="um-preview-img-wrap">
              <img src={preview} alt="Preview" className="um-preview-img" />
              <button className="um-remove-img" onClick={() => setPreview(null)} aria-label="Remove image">
                <FiX size={16} />
              </button>
            </div>

            <div className="um-caption-wrap">
              <FiType size={16} className="um-caption-icon" />
              <input
                className="um-caption-input"
                type="text"
                placeholder="Add a caption (optional)…"
                value={caption}
                maxLength={120}
                onChange={e => setCaption(e.target.value)}
                id="story-caption-input"
              />
            </div>
            {caption && <div className="um-char-count">{120 - caption.length} chars left</div>}
          </div>
        )}

        <div className="um-footer">
          <button className="um-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="um-btn-post"
            onClick={handlePost}
            disabled={!preview}
            aria-disabled={!preview}
            id="um-post-button"
          >
            <FiImage size={16} />
            Share Story
          </button>
        </div>
      </div>
    </div>
  );
}
