import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' }, // Default role is 'member'
});

const messageSchema = new mongoose.Schema({
  messageType: { type: String, enum: ['text', 'media'], required: true },
  content: {
    text: { type: String },
    mediaLinks: [{ type: String }],
  },
  mediaLinks: [{ type: String }],
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  website: { type: String, required: true },
  purpose: { type: String, required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  description: { type: String, required: true },
  coverPhoto: { type: String, required: true, match: /^(http|https):\/\// },
  pagePhoto: { type: String, required: true, match: /^(http|https):\/\// },
  anyoneCanJoin: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema],
  messages: [messageSchema],
  // Additional Fields for Messaging
  lastMessage: { type: messageSchema }, 
  unreadCount: { type: Number, default: 0 }, // Array of pinned messages
  mutedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Members who muted the group
}, { timestamps: true });


const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export { Group, Message };
