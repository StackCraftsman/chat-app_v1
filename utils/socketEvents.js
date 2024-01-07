// socketEvents.js
import { sendErrorMessage } from '../controllers/chatController.js';
import {
  createGroup,
  joinGroup,
  leaveGroup,
  makeGroupAdmin,
  generateSlug

} from '../controllers/groupController.js';

export default function socketEvents(socket, io) {
  handleChat(io, socket);

  socket.on('create group', (data) => createGroup(data, io));
  socket.on('join group', (data) => joinGroup(data, io));
  socket.on('leave group', (data) => leaveGroup(data, io));
  socket.on('make group admin', (data) => makeGroupAdmin(data, io));
  socket.on('generate slug', (data)=> generateSlug(data, io))

}
