import React, { useState, useEffect } from 'react';
import { getAnnouncements, addAnnouncement, toggleAnnouncement, deleteAnnouncement, Announcement } from '@/lib/mlmStore';
import { Plus, Trash2, Power, Image as ImageIcon, Upload } from 'lucide-react';

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [error, setError] = useState('');

  const loadData = () => setAnnouncements(getAnnouncements());

  useEffect(() => {
    loadData();
    window.addEventListener('announcements_update', loadData);
    return () => window.removeEventListener('announcements_update', loadData);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress heavily to ensure it fits in Firestore easily
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setImageBase64(compressedBase64);
        setError('');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !imageBase64) {
      setError('Title and Image are required.');
      return;
    }
    
    try {
      addAnnouncement(title, imageBase64, description);
      setTitle('');
      setDescription('');
      setImageBase64('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Announcements & Banners</h2>
        <p className="text-gray-400 mt-1">Manage promotional banners and product launch announcements for the homepage and user dashboard.</p>
        <p className="text-xs text-emerald-400 mt-2">You can add up to 10 banners. Deleting a banner permanently removes its data.</p>
      </div>

      <div className="bg-[#132C3C] p-6 rounded-2xl shadow-xl border border-[#28485A]/50">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#8FA3AF]" />
          Add New Banner
        </h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Banner Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-[#071E2C] border border-[#28485A] rounded-lg text-white focus:outline-none focus:border-[#6F9DB5]"
              placeholder="e.g., New Product Launch!"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Banner Image</label>
            <div className="relative">
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="banner-image-upload"
              />
              <label 
                htmlFor="banner-image-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#071E2C] border border-[#28485A] rounded-lg text-gray-300 hover:text-white hover:bg-[#1B3343] cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                {imageBase64 ? 'Change Image' : 'Select Image'}
              </label>
            </div>
          </div>
          
          {imageBase64 && (
            <div className="md:col-span-2 mt-2">
              <p className="text-xs text-gray-400 mb-1">Image Preview:</p>
              <img src={imageBase64} alt="Preview" className="h-32 object-contain rounded-lg border border-[#28485A]" />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#071E2C] border border-[#28485A] rounded-lg text-white focus:outline-none focus:border-[#6F9DB5] h-20 resize-none"
              placeholder="Add some details about this announcement..."
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end">
            <button 
              type="submit"
              disabled={!title || !imageBase64}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              Publish Banner
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map(ann => (
          <div key={ann.id} className={`bg-[#132C3C] rounded-2xl overflow-hidden shadow-xl border ${ann.isActive ? 'border-emerald-500/30' : 'border-[#28485A]/50 opacity-70'}`}>
            <div className="h-48 overflow-hidden relative bg-black/20">
              <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover" />
              {!ann.isActive && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">Inactive</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="text-white font-semibold mb-1 line-clamp-1">{ann.title}</h4>
              {ann.description && (
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{ann.description}</p>
              )}
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#28485A]/30">
                <button 
                  onClick={() => toggleAnnouncement(ann.id, !ann.isActive)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${ann.isActive ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'}`}
                >
                  <Power className="w-4 h-4" />
                  {ann.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to completely delete this banner? Its data will be permanently removed.')) {
                      deleteAnnouncement(ann.id);
                    }
                  }}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-[#28485A] rounded-2xl">
            <ImageIcon className="w-12 h-12 text-[#28485A] mx-auto mb-3" />
            <p className="text-gray-400">No banners or announcements yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
