import { Group } from '../model/groups.model.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

export const createGroup = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      slug: customSlug,
      phone,
      website,
      purpose,
      visibility,
      description,
      coverPhoto,
      pagePhoto,
      anyoneCanJoin,
      userId
    } = req.body;

    let slug = customSlug || slugify(name, { lower: true });

    const existingGroup = await Group.findOne({ name, createdBy: userId });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        error: 'You already created a group with the same name'
      });
    }

    const existingSlug = await Group.findOne({ slug });

    if (existingSlug) {
      const uniqueSlug = `${slug}-${Date.now().toString(36).substring(2, 8)}`;
      slug = uniqueSlug;
    }

    const group = await Group.create({
      name,
      slug,
      phone,
      website,
      purpose,
      visibility,
      description,
      coverPhoto,
      pagePhoto,
      anyoneCanJoin,
      createdBy: userId,
      members: [{ userId, role: 'admin' }],
      admins: [userId],
    });

    const io = req.app.get('io');
    await io.to(group._id.toString()).emit('group created', {
      groupId: group._id.toString(),
      groupName: group.name,
      createdBy: userId
    });

    res.json({
      success: true,
      groupId: group._id.toString(),
      createdBy: userId
    });
  } catch (error) {
    console.error('Error creating group:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create group'
    });
  }
});

export const updateGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, updates } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    Object.keys(updates).forEach((key) => {
      group[key] = updates[key];
    });

    await group.save();

    res.json({ success: true, updatedGroup: group });
  } catch (error) {
    console.error('Error updating group:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update group' });
  }
});

export const deleteGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    const io = req.app.get('io');

    if (group.admins.includes(userId)) {
      await Group.findByIdAndDelete(groupId);
      io.to(groupId.toString()).emit('group deleted', { groupId });
      res.json({ success: true });
    } else {
      res.status(403).json({ success: false, error: 'You are not the admin of this group' });
    }
  } catch (error) {
    console.error('Error deleting group:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete group' });
  }
});

export const joinGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userIds } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    const existingMembers = group.members || [];

    const existingUsers = existingMembers.filter((member) => userIds.includes(member.toString()));

    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, error: 'One or more users are already members of the group' });
    }

    group.members = existingMembers.concat(userIds);
    await group.save();

    const io = req.app.get('io');
    await io.to(groupId.toString()).emit('user joined', { userIds, groupId });

    res.json({ success: true });
  } catch (error) {
    console.error('Error joining group:', error.message);
    res.status(500).json({ success: false, error: 'Failed to join group' });
  }
});

export const leaveGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({ success: false, error: 'User is not a member of the group' });
    }

    const index = group.members.indexOf(userId);
    group.members.splice(index, 1);
    await group.save();

    const io = req.app.get('io');
    await io.to(groupId.toString()).emit('user left', { userId, groupId });
    res.json({ success: true });
  } catch (error) {
    console.error('Error leaving group:', error.message);
    res.status(500).json({ success: false, error: 'Failed to leave group' });
  }
});

export const getGroupAdmins = asyncHandler(async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('admins', 'username email');

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    res.json({ success: true, admins: group.admins });
  } catch (error) {
    console.error('Error getting group admins:', error.message);
    res.status(500).json({ success: false, error: 'Failed to get group admins' });
  }
});

export const makeGroupAdmin = asyncHandler(async (req, res) => {
  try {
    const { groupId, adminUserId, targetUserId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    if (!group.admins.includes(adminUserId)) {
      return res.status(403).json({ success: false, error: 'You are not authorized to make others admins' });
    }

    if (!group.members.includes(targetUserId)) {
      return res.status(400).json({ success: false, error: 'User is not a member of the group' });
    }

    if (!group.admins.includes(targetUserId)) {
      group.admins.push(targetUserId);
      await group.save();

      const io = req.app.get('io');
      await io.to(groupId.toString()).emit('admin added', { userId: targetUserId, groupId });
    }

    res.json({ success: true, admins: group.admins });
  } catch (error) {
    console.error('Error making user admin:', error.message);
    res.status(500).json({ success: false, error: 'Failed to make user admin' });
  }
});

export const getGroups = asyncHandler(async (req, res) => {
  try {
    const groups = await Group.find();
    res.json({ success: true, groups });
  } catch (error) {
    console.error('Error getting groups:', error.message);
    res.status(500).json({ success: false, error: 'Failed to get groups' });
  }
});

const existingSlugs = []; 

export const generateSlug = async (req, res) => {
  try {
    const { name } = req.body;

    const baseSlug = slugify(name, { lower: true });

    let finalSlug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    existingSlugs.push(finalSlug); 

    res.json({ success: true, slug: finalSlug });
  } catch (error) {
    console.error('Error generating slug:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate slug' });
  }
};

  

//   654a7c287a18d97412a0bf3d
// 654a7be5b5b60816c3e96ad3
// 654a7bfeb5b60816c3e96ad7