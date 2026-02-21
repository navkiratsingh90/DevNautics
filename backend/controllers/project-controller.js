import ProjectCollab from "../models/collabspace-model.js";
import requestCollabModel from "../models/requestCollab-model.js";
import User from "../models/user-model.js";
import Users from '../models/user-model.js'
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/datauri.js';
// import requestCollab from "../models/requestCollab-model.js";

export const createNewProjectCollaboration = async (req, res) => {
  console.log(req.body);
    try {
      const {
        title,
        description,
        status,
        problemStatement,
        rolesLookingFor,
        techStackUsed,
        Category,
        totalTeamSize,
        currentTeamMembers = [],
      } = req.body;
      let fileUrl = null;
      if (
        !title ||
        !description ||
        !status ||
        !problemStatement ||
        !rolesLookingFor ||
        !techStackUsed ||
        !totalTeamSize
      ) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
  
      const userId = req.user.userID || req.user._id;
      if (req.file) {
        const fileUri = getDataUri(req.file);
        const uploadRes = await cloudinary.uploader.upload(fileUri.content);
        fileUrl = uploadRes.secure_url;
      }
      // 1️⃣ Fetch users
      const users = await Users.find({}, { username: 1 });
      const userMap = new Map();
  
      users.forEach(user => {
        userMap.set(user.username.toLowerCase(), user._id);
      });
  
      // 2️⃣ Convert usernames → ObjectIds
      const convertedMembers = [];
  
      for (let member of currentTeamMembers) {
        if (!member.username || !member.roleAssigned) {
          return res.status(400).json({
            message: "Each member must have username and roleAssigned"
          });
        }
  
        const userObjectId = userMap.get(member.username.toLowerCase());
  
        if (!userObjectId) {
          return res.status(404).json({
            message: `User not found with username ${member.username}`
          });
        }
  
        convertedMembers.push({
          user: userObjectId,
          roleAssigned: member.roleAssigned
        });
      }
  
      // 3️⃣ Team size validation
      if (convertedMembers.length > totalTeamSize) {
        return res.status(400).json({
          message: "Team size exceeds totalTeamSize"
        });
      }
  
      // 4️⃣ Ensure project owner exists
      const ownerExists = convertedMembers.some(
        m => m.user.toString() === userId.toString()
      );
  
      if (!ownerExists) {
        convertedMembers.push({
          user: userId,
          roleAssigned: "Project Owner"
        });
      }
  
      // 5️⃣ Create project
      const newProject = new ProjectCollab({
        title,
        description,
        status,
        file: fileUrl,
        problemStatement,
        Category,
        rolesLookingFor,
        techStackUsed,
        totalTeamSize,
        currentTeamMembers: convertedMembers,
        createdBy: userId,
      });
  
      await newProject.save();
  
      res.status(201).json({
        message: "Project collaboration created successfully",
        project: newProject,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const updateCurrentProject = async (req, res) => {
    try {
      const { id } = req.params;
      const { description, status, rolesLookingFor } = req.body;
      const userId = req.user.userID || req.user._id;
  
      const project = await ProjectCollab.findById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      if (project.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You are not the owner of this project" });
      }
      /* ---------------- BASIC UPDATES ---------------- */
      if (description) project.description = description;
      if (status) project.status = status;
      if (rolesLookingFor && rolesLookingFor.length > 0) {

        let roles = [];
      
        if (typeof rolesLookingFor === "string") {
          roles = rolesLookingFor
            .split(",")
            .map(role => role.trim())
            .filter(Boolean);
        } else if (Array.isArray(rolesLookingFor)) {
          roles = rolesLookingFor;
        }
      
        roles.forEach(role => {
          const index = project.rolesLookingFor.indexOf(role);
      
          if (index > -1) {
            project.rolesLookingFor.splice(index, 1);
          } else {
            project.rolesLookingFor.push(role);
          }
        });
      }
  
      const updatedProject = await project.save();
  
      res.status(200).json({
        message: "Project updated successfully",
        project: updatedProject
      });
  
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  };
  
  

export const getAllProjects = async (req, res) => {
    try {
      const { filters = {}, sort = "createdAt", order = "desc" } = req.body;
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const query = {};
  
      Object.keys(filters).forEach((key) => {
        if (Array.isArray(filters[key]) && filters[key].length > 0) {
          query[key] = { $in: filters[key] };
        } else if (filters[key]) {
          query[key] = filters[key];
        }
      });
  
      const sortOrder = order === "asc" ? 1 : -1;
  
      const projects = await ProjectCollab.find(query)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "username email profilePic")
        .populate("currentTeamMembers.user", "username email profilePic");
  
      const totalProjects = await ProjectCollab.countDocuments(query);
  
      res.status(200).json({
        success: true,
        data: projects,
        pagination: {
          totalProjects,
          totalPages: Math.ceil(totalProjects / limit),
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
  

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const project = await ProjectCollab.findById(id)
            .populate("currentTeamMembers.user", "username email profilePic")
            .populate("createdBy", "username email profilePic");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const relatedProjects = await ProjectCollab.find({
            _id: { $ne: project._id },
            techStackUsed: { $in: project.techStackUsed },
        }).limit(5);

        const spotsLeft =
            project.totalTeamSize - project.currentTeamMembers.length;
        return res.status(200).json({
            message: "Project retrieved successfully",
            data: project,
            spotsLeft,
            relatedProjects,
        });
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
export const deleteProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const project = await ProjectCollab.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({
            message: "Project deleted successfully",
            data: project,
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const addTeammate = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { username, role } = req.body;

    if (!username || !role) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const userId = req.user.userID || req.user._id;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ msg: "No such user exists" });
    }


    const project = await ProjectCollab.findById(id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const isAdmin =
      project.createdBy.toString() === userId.toString();

    if (!isAdmin) {
      return res.status(403).json({ msg: "You are not admin" });
    }

    const alreadyMember = project.currentTeamMembers.some(
      member => member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ msg: "User already in team" });
    }

    if (project.currentTeamMembers.length >= project.totalTeamSize) {
      return res.status(400).json({ msg: "Team is already full" });
    }

    project.currentTeamMembers.push({
      user: user._id,
      roleAssigned: role
    });

    await project.save();

    return res.status(200).json({
      msg: "User added successfully",
      project
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};
