import express from 'express';
  
  import { createGroup, deleteGroup, joinGroup, leaveGroup, makeGroupAdmin,getGroupAdmins,getGroups,generateSlug, } from '../controllers/groupController.js';

const groupRouter = express.Router();

groupRouter.post('/groups/create', createGroup);
groupRouter.delete('/groups/delete', deleteGroup);
groupRouter.post('/groups/join', joinGroup);
groupRouter.post('/groups/leave', leaveGroup);
groupRouter.post('/groups/make-admin', makeGroupAdmin);
groupRouter.get('/group/admins/:groupId', getGroupAdmins);
groupRouter.get('/groups', getGroups);
groupRouter.post('/groups/slug',generateSlug);

 
export default groupRouter;


// 654a7c287a18d97412a0bf3d
// 654a7be5b5b60816c3e96ad3
// 654a7bfeb5b60816c3e96ad7