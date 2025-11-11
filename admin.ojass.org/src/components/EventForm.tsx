'use client';

import { useState } from 'react';
import { Event, CreateEventData, EventPrizes, EventHead } from '@/lib/api';
import { mediaAPI } from '@/lib/api';

interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: CreateEventData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function EventForm({ event, onSubmit, onCancel, loading }: EventFormProps) {
  const [formData, setFormData] = useState<CreateEventData>({
    name: event?.name || '',
    teamSizeMin: event?.teamSizeMin || 1,
    teamSizeMax: event?.teamSizeMax || 1,
    isTeamEvent: event?.isTeamEvent ?? true,
    img: event?.img || '',
    rulebookurl: event?.rulebookurl || '',
    redirect: event?.redirect || '',
    organizer: event?.organizer || '',
    description: event?.description || '',
    prizes: event?.prizes || {
      total: '',
      winner: '',
      first_runner_up: '',
      second_runner_up: '',
    },
    details: event?.details || [''],
    rules: event?.rules || [''],
    event_head: event?.event_head || {
      name: '',
      Phone: '',
    },
    winners: event?.winners || [],
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      let updatedData: CreateEventData;
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        updatedData = {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof CreateEventData] as any),
            [child]: value,
          },
        };
      } else {
        updatedData = { ...prev, [field]: value };
      }
      
      // If changing to individual event, automatically set both team sizes to 1
      if (field === 'isTeamEvent' && value === false) {
        updatedData.teamSizeMin = 1;
        updatedData.teamSizeMax = 1;
      }
      
      return updatedData;
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (field: 'details' | 'rules', index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'details' | 'rules') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'details' | 'rules', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await mediaAPI.upload(file);
      if (response.files && response.files.length > 0) {
        handleChange('img', response.files[0].url);
      }
    } catch (error: any) {
      setErrors({ img: error.message || 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.img.trim()) newErrors.img = 'Event image is required';
    if (!formData.rulebookurl.trim()) newErrors.rulebookurl = 'Rulebook URL is required';
    if (!formData.redirect.trim()) newErrors.redirect = 'Redirect path is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.teamSizeMin < 1) newErrors.teamSizeMin = 'Minimum team size must be at least 1';
    if (formData.teamSizeMax < formData.teamSizeMin) newErrors.teamSizeMax = 'Maximum must be >= minimum';
    if (!formData.prizes.total.trim()) newErrors['prizes.total'] = 'Total prize is required';
    if (!formData.prizes.winner.trim()) newErrors['prizes.winner'] = 'Winner prize is required';
    if (!formData.prizes.first_runner_up.trim()) newErrors['prizes.first_runner_up'] = 'First runner-up prize is required';
    if (!formData.prizes.second_runner_up.trim()) newErrors['prizes.second_runner_up'] = 'Second runner-up prize is required';
    if (formData.details.filter(d => d.trim()).length === 0) newErrors.details = 'At least one detail is required';
    if (formData.rules.filter(r => r.trim()).length === 0) newErrors.rules = 'At least one rule is required';
    if (!formData.event_head.name.trim()) newErrors['event_head.name'] = 'Event head name is required';
    if (!formData.event_head.Phone.trim()) newErrors['event_head.Phone'] = 'Event head phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clean up empty array items
    // For individual events, ensure both team sizes are 1
    const cleanedData: CreateEventData = {
      ...formData,
      teamSizeMin: formData.isTeamEvent ? formData.teamSizeMin : 1,
      teamSizeMax: formData.isTeamEvent ? formData.teamSizeMax : 1,
      details: formData.details.filter(d => d.trim()),
      rules: formData.rules.filter(r => r.trim()),
      organizer: formData.organizer || undefined,
    };

    try {
      await onSubmit(cleanedData);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save event' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.isTeamEvent ? 'team' : 'individual'}
            onChange={(e) => handleChange('isTeamEvent', e.target.value === 'team')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="team">Team Event</option>
            <option value="individual">Individual Event</option>
          </select>
        </div>

        {formData.isTeamEvent ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Team Size <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.teamSizeMin}
                onChange={(e) => handleChange('teamSizeMin', parseInt(e.target.value) || 1)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.teamSizeMin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.teamSizeMin && <p className="text-red-500 text-sm mt-1">{errors.teamSizeMin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Team Size <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={formData.teamSizeMin}
                value={formData.teamSizeMax}
                onChange={(e) => handleChange('teamSizeMax', parseInt(e.target.value) || 1)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.teamSizeMax ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.teamSizeMax && <p className="text-red-500 text-sm mt-1">{errors.teamSizeMax}</p>}
            </div>
          </>
        ) : (
          <div className="md:col-span-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Individual Event:</strong> Team size is automatically set to 1 (individual participants only).
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organizer
          </label>
          <input
            type="text"
            value={formData.organizer || ''}
            onChange={(e) => handleChange('organizer', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rulebook URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={formData.rulebookurl}
            onChange={(e) => handleChange('rulebookurl', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.rulebookurl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.rulebookurl && <p className="text-red-500 text-sm mt-1">{errors.rulebookurl}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Redirect Path <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.redirect}
            onChange={(e) => handleChange('redirect', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.redirect ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.redirect && <p className="text-red-500 text-sm mt-1">{errors.redirect}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banner Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={uploading}
        />
        {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
        {formData.img && (
          <div className="mt-2">
            <img src={formData.img} alt="Event banner" className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}
        {errors.img && <p className="text-red-500 text-sm mt-1">{errors.img}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Prizes */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Prizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Prize <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prizes.total}
              onChange={(e) => handleChange('prizes.total', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors['prizes.total'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors['prizes.total'] && <p className="text-red-500 text-sm mt-1">{errors['prizes.total']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Winner Prize <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prizes.winner}
              onChange={(e) => handleChange('prizes.winner', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors['prizes.winner'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors['prizes.winner'] && <p className="text-red-500 text-sm mt-1">{errors['prizes.winner']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Runner-up <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prizes.first_runner_up}
              onChange={(e) => handleChange('prizes.first_runner_up', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors['prizes.first_runner_up'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors['prizes.first_runner_up'] && <p className="text-red-500 text-sm mt-1">{errors['prizes.first_runner_up']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Runner-up <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prizes.second_runner_up}
              onChange={(e) => handleChange('prizes.second_runner_up', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors['prizes.second_runner_up'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors['prizes.second_runner_up'] && <p className="text-red-500 text-sm mt-1">{errors['prizes.second_runner_up']}</p>}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Event Details</h3>
          <button
            type="button"
            onClick={() => addArrayItem('details')}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            + Add Detail
          </button>
        </div>
        {formData.details.map((detail, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={detail}
              onChange={(e) => handleArrayChange('details', index, e.target.value)}
              placeholder={`Detail ${index + 1}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formData.details.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('details', index)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
      </div>

      {/* Rules */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Event Rules</h3>
          <button
            type="button"
            onClick={() => addArrayItem('rules')}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            + Add Rule
          </button>
        </div>
        {formData.rules.map((rule, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={rule}
              onChange={(e) => handleArrayChange('rules', index, e.target.value)}
              placeholder={`Rule ${index + 1}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formData.rules.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('rules', index)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {errors.rules && <p className="text-red-500 text-sm mt-1">{errors.rules}</p>}
      </div>

      {/* Event Head */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Head</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.event_head.name}
              onChange={(e) => handleChange('event_head.name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors['event_head.name'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors['event_head.name'] && <p className="text-red-500 text-sm mt-1">{errors['event_head.name']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.event_head.Phone}
              onChange={(e) => handleChange('event_head.Phone', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors['event_head.Phone'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors['event_head.Phone'] && <p className="text-red-500 text-sm mt-1">{errors['event_head.Phone']}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
          disabled={loading || uploading}
        >
          {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}

