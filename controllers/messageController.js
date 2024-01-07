// messageController.js
import { Group } from '../model/groups.model.js';

const generateUniqueClientOffset = () => {
  return Date.now().toString();
};


const saveMessage = async (userId, groupId, content) => {
  try {
    const client_offset = generateUniqueClientOffset();

    const messageType = content.mediaLinks && content.mediaLinks.length > 0 ? 'media' : 'text';

    const message = {
      content: {
        text: content.text || '',
        mediaLinks: content.mediaLinks || [],
      },
      client_offset,
      sender: userId,
      messageType,
    };

    await Group.findByIdAndUpdate(groupId, { $push: { messages: message } });

    return message;
  } catch (error) {
    throw error;
  }
};



const getAllMessages = async (groupId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      console.log(`Group with ID ${groupId} not found`);
      throw new Error('Group not found');
    }

    const messages = group.messages.map((message) => message.content.text);
    return messages;
  } catch (error) {
    console.error('Error retrieving messages:', error.message);
    throw error;
  }
};


export { saveMessage , getAllMessages };





// {
//   "groupId": "655cdc8d017f85aec24284b6",
//   "userId": "654a7bfeb5b60816c3e96ad7",
//   "content": {
//     "text": "Hello, this is a text message.",
//     "mediaLinks": [
//       "http://example.com/image.jpg",
//       "http://example.com/video.mp4"
//     ]
//   }
// }

// wscat -n -c "wss://3.27.152.189/other/message2?username=alice"
