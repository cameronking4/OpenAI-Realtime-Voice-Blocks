import { useState } from 'react';
import axios from 'axios';

const AssistantForm = () => {
  const [formData, setFormData] = useState({
    transcriberProvider: '',
    modelProvider: '',
    modelName: '',
    messages: '',
    functions: '',
    voiceProvider: '',
    voiceId: '',
    forwardingPhoneNumber: '',
    voicemailMessage: '',
    firstMessage: '',
    endCallMessage: '',
    recordingEnabled: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.vapi.ai/assistant', formData, {
        headers: {
          Authorization: `Bearer YOUR_API_KEY`,
        },
      });
      console.log('Assistant created successfully:', response.data);
    } catch (error) {
      console.error('Error creating assistant:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Configure VAPI Assistant</h2>
      <label>
        Transcriber Provider:
        <input type="text" name="transcriberProvider" value={formData.transcriberProvider} onChange={handleChange} required />
      </label>
      <label>
        Model Provider:
        <input type="text" name="modelProvider" value={formData.modelProvider} onChange={handleChange} required />
      </label>
      <label>
        Model Name:
        <input type="text" name="modelName" value={formData.modelName} onChange={handleChange} required />
      </label>
      <label>
        Messages (JSON format):
        <textarea name="messages" value={formData.messages} onChange={handleChange} required></textarea>
      </label>
      <label>
        Functions (JSON format):
        <textarea name="functions" value={formData.functions} onChange={handleChange} required></textarea>
      </label>
      <label>
        Voice Provider:
        <input type="text" name="voiceProvider" value={formData.voiceProvider} onChange={handleChange} required />
      </label>
      <label>
        Voice ID:
        <input type="text" name="voiceId" value={formData.voiceId} onChange={handleChange} required />
      </label>
      <label>
        Forwarding Phone Number:
        <input type="text" name="forwardingPhoneNumber" value={formData.forwardingPhoneNumber} onChange={handleChange} />
      </label>
      <label>
        Voicemail Message:
        <textarea name="voicemailMessage" value={formData.voicemailMessage} onChange={handleChange}></textarea>
      </label>
      <label>
        First Message:
        <textarea name="firstMessage" value={formData.firstMessage} onChange={handleChange} required></textarea>
      </label>
      <label>
        End Call Message:
        <textarea name="endCallMessage" value={formData.endCallMessage} onChange={handleChange}></textarea>
      </label>
      <label>
        Recording Enabled:
        <input type="checkbox" name="recordingEnabled" checked={formData.recordingEnabled} onChange={handleChange} />
      </label>
      <button type="submit">Create Assistant</button>
    </form>
  );
};

export default AssistantForm;
