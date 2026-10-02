import React, { useState, useEffect } from 'react';
import { PenSquare, Trash2, Plus, Sparkles, Loader2 } from 'lucide-react';
import './index.css';

const API_URL = 'http://localhost:3000/api/notes';

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
];

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Note State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          color: selectedColor
        })
      });
      
      if (!res.ok) throw new Error('Failed to create note');
      
      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      
      // Reset form
      setTitle('');
      setContent('');
      setSelectedColor(COLORS[0]);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to delete note');
      
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <Sparkles className="logo-icon" size={32} />
          <span>Aura Notes</span>
        </div>
      </header>

      <main>
        <form className="note-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea 
            placeholder="Take a note..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />
          
          <div className="form-actions">
            <div className="color-picker">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              <span>Add Note</span>
            </button>
          </div>
        </form>

        {loading ? (
          <div className="loading">Loading your thoughts...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <PenSquare size={48} />
            <h2>No notes yet</h2>
            <p>Your beautiful thoughts will appear here.</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <div 
                key={note._id} 
                className="note-card"
                style={{ '--note-color': note.color }}
              >
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(note._id)}
                    aria-label="Delete note"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="note-content">
                  {note.content}
                </div>
                <div className="note-footer">
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
