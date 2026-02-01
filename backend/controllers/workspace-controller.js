import User from "../models/user-model.js";
import ProjectTracker from "../models/projectTracker-model.js";

// controller which i will be making...

// create new project for tracking progress -> add teamates, desc, title, status,
export const createNewProject = async (req, res) => {
    try {
      const {
        title,
        description,
        timeline,
        leader,
        members,
        githubLink,
        status,
      } = req.body;
  
      // ✅ Validate required fields
      if (
        !title ||
        !description ||
        !timeline ||
        !leader ||
        !status ||
        !githubLink
      ) {
        return res.status(400).json({
          msg: "Missing required fields. Please provide all necessary details.",
        });
      }
  
      // ✅ Create new project
      const newProject = await ProjectTracker.create({
        title,
        description,
        timeline,
        leader,
        members,
        githubLink,
        status,
      });
  
      // ✅ Send success response
      return res.status(201).json({
        msg: "Project created successfully!",
        project: newProject,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      return res.status(500).json({
        msg: "Internal Server Error. Could not create project.",
        error: error.message,
      });
    }
  };
// assign roles to each member
export const addMembers = async (req, res) => {
    try {
      const { members, projectId } = req.body;
  
      // ✅ Validation
      if (!members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ msg: "Please provide members to add." });
      }
      if (!projectId) {
        return res.status(400).json({ msg: "Project ID is required." });
      }
  
      // ✅ Find project
      const project = await ProjectTracker.findById(projectId);
      if (!project) {
        return res.status(404).json({ msg: "Project not found." });
      }
  
      // ✅ Check for duplicate users in request
      const newUserIds = members.map((m) => m.user.toString());
      const hasDuplicateInRequest = new Set(newUserIds).size !== newUserIds.length;
      if (hasDuplicateInRequest) {
        return res.status(400).json({ msg: "Duplicate users found in request members." });
      }
  
      // ✅ Check if any of the new members already exist in the project
      for (let member of members) {
        const exists = project.members.some(
          (m) => m.user.toString() === member.user.toString()
        );
        if (exists) {
          return res.status(400).json({
            msg: `User ${member.user} already exists in this team.`,
          });
        }
      }
  
      // ✅ Add new members
      project.members.push(...members);
      const updatedProject = await project.save();
  
      return res.status(200).json({
        msg: "Members added successfully!",
        project: updatedProject,
      });
    } catch (error) {
      console.error("Error adding members:", error);
      return res.status(500).json({
        msg: "Internal Server Error. Could not add members.",
        error: error.message,
      });
    }
  };
// assign tasks to each member
export const assignTasks = async (req, res) => {
    try {
      const { description, priority, assignedTo, projectId } = req.body;
      const userId = req.user; // assumed set by auth middleware
  
      // ✅ Validate request body
      if (!description || !priority || !assignedTo || !projectId) {
        return res.status(400).json({ msg: "All fields are required." });
      }
  
      // ✅ Validate priority value
      const validPriorities = ["Low", "Medium", "High"];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ msg: "Invalid priority value." });
      }
  
      // ✅ Find project
      const currProject = await ProjectTracker.findById(projectId);
      if (!currProject) {
        return res.status(404).json({ msg: "Project not found." });
      }
  
      // ✅ Check if requester is leader
      if (currProject.leader.toString() !== userId.toString()) {
        return res.status(403).json({ msg: "Only the leader can assign tasks." });
      }
  
      // ✅ Check if assigned user is a project member
      const isMember = currProject.members.some(
        (ele) => ele.user.toString() === assignedTo.toString()
      );
      if (!isMember) {
        return res
          .status(400)
          .json({ msg: "Assigned user is not a member of this project." });
      }
  
      // ✅ Create and push new task
      const task = {
        description,
        priority,
        assignedTo,
      };
  
      currProject.tasks.push(task);
      await currProject.save();
  
      // ✅ Return latest task
      const latestTask = currProject.tasks[currProject.tasks.length - 1];
  
      return res.status(200).json({
        msg: "Task assigned successfully.",
        task: latestTask,
        totalTasks: currProject.tasks.length,
      });
    } catch (error) {
      console.error("Error assigning task:", error);
      return res.status(500).json({
        msg: "Internal Server Error. Could not assign task.",
        error: error.message,
      });
    }
  };
  
//get tasks by user
export const getUserTasks = async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.user; // from auth middleware
  
      // ✅ Validation
      if (!userId || !projectId) {
        return res.status(400).json({ msg: "User ID or Project ID missing." });
      }
  
      // ✅ Fetch project
      const currProject = await ProjectTracker.findById(projectId);
      if (!currProject) {
        return res.status(404).json({ msg: "Project not found." });
      }
  
      // ✅ Check if user is part of the project
      const isMember = currProject.members.some(
        (ele) => ele.user.toString() === userId.toString()
      );
      if (!isMember && currProject.leader.toString() !== userId.toString()) {
        return res.status(403).json({
          msg: "Access denied. You are not a member or leader of this project.",
        });
      }
  
      // ✅ Filter user's tasks
      const userTasks = currProject.tasks.filter(
        (task) => task.assignedTo.toString() === userId.toString()
      );
  
      // ✅ Response
      return res.status(200).json({
        msg: "Tasks fetched successfully.",
        totalTasks: userTasks.length,
        tasks: userTasks,
      });
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      return res.status(500).json({
        msg: "Internal Server Error. Could not fetch tasks.",
        error: error.message,
      });
    }
  };
  

export const markTaskCompleted = async (req, res) => {
    try {
        const { projectId, taskId } = req.body;
        const userId = req.user;

        const project = await ProjectTracker.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        const task = project.tasks.id(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        if (task.assignedTo.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "You cannot modify others' tasks" });
        }

        task.status = "Completed";

        // increment member’s completed tasks count
        const member = project.members.find(
            (m) => m.user.toString() === userId.toString()
        );
        if (member) member.totalTasksCompleted = parseInt(member.totalTasksCompleted) + 1;

        await project.save();

        res.status(200).json({ msg: "Task marked as completed", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { githubLink, lastCommitMessage, timeline, status } = req.body;
        const userId = req.user;

        const project = await ProjectTracker.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        if (project.leader.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "Only leader can update project" });
        }

        if (githubLink) project.githubLink = githubLink;
        if (lastCommitMessage) project.lastCommitMessage = lastCommitMessage;
        if (timeline) project.timeline = timeline;
        if (status) project.status = status;

        const updated = await project.save();
        res.status(200).json({ msg: "Project updated", project: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};


export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user;
        if (!projectId) {
        } // problem

        const currProject = await ProjectTracker.findById(projectId);

        if (!currProject) {
        } // problem

        const isMember = currProject.members.some(
            (ele) => ele.user.toString() === userId.toString()
        );
        if (!isMember) {
        } //problem

        const userTasks = [];
        for (let task of currProject.tasks) {
            if (task.assignedTo.toString() == userId.toString()) {
                userTasks.push(task);
            }
        }
        let progressMeter = 0;
        let totalTimelinesCompleted = 0;

        for (let time of currProject.timeline) {
            if (time.completed) totalTimelinesCompleted++;
        }

        if (currProject.timeline.length > 0)
            progressMeter = totalTimelinesCompleted / currProject.timeline.length;


        res.status(200).json({
            message: "Project fetched successfully",
            allTasks: userTasks,
            members: currProject.members,
            progressMeter,
            project: currProject,
        });
    } catch (error) {
        console.error(error);
    }
};
// get all ongoing projects
export const getProjectByStatus = async (req, res) => {
    try {
        const userId = req.user;
        const { status } = req.query; // use query param like ?status=Active

        if (!userId || !status) {
            return res.status(400).json({ msg: "Invalid query or user" });
        }

        const projects = await ProjectTracker.find({ status });

        res.status(200).json({
            msg: "Projects fetched successfully",
            projects,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

// delete any project by id
export const deleteProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user;

        if (!userId || !projectId) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const currProject = await ProjectTracker.findById(projectId);
        if (!currProject) {
            return res.status(404).json({ msg: "Project not found" });
        }

        // Only leader can delete project
        if (currProject.leader.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "Only leader can delete project" });
        }

        await ProjectTracker.findByIdAndDelete(projectId);

        res.status(200).json({
            msg: "Project deleted successfully",
            projectId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};


// get top contributers teammates for a project by id
export const getTopContributors = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectTracker.findById(projectId).populate("members.user");

        if (!project) return res.status(404).json({ msg: "Project not found" });

        const sortedMembers = [...project.members].sort(
            (a, b) => b.totalTasksCompleted - a.totalTasksCompleted
        );

        res.status(200).json({
            msg: "Top contributors fetched",
            contributors: sortedMembers.slice(0, 5), // top 5
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

//
export const addCalendarEvent = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, startDate, endDate, assignedMembers, type } = req.body;
        const userId = req.user;

        const project = await ProjectTracker.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        if (project.leader.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "Only leader can add events" });
        }

        const newEvent = {
            title,
            description,
            startDate,
            endDate,
            assignedMembers,
            type
        };

        project.calendar.push(newEvent);
        await project.save();

        res.status(200).json({ msg: "Event added successfully", event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateCalendarEvent = async (req, res) => {
    try {
        const { projectId, eventId } = req.params;
        const { title, description, startDate, endDate, assignedMembers, type } = req.body;
        const userId = req.user;

        const project = await ProjectTracker.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        const event = project.calendar.id(eventId);
        if (!event) return res.status(404).json({ msg: "Event not found" });

        if (project.leader.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "Only leader can edit events" });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.startDate = startDate || event.startDate;
        event.endDate = endDate || event.endDate;
        event.assignedMembers = assignedMembers || event.assignedMembers;
        event.type = type || event.type;

        await project.save();

        res.status(200).json({ msg: "Event updated", event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteCalendarEvent = async (req, res) => {
    try {
        const { projectId, eventId } = req.params;
        const userId = req.user;

        const project = await ProjectTracker.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        if (project.leader.toString() !== userId.toString()) {
            return res.status(403).json({ msg: "Only leader can delete events" });
        }

        project.calendar = project.calendar.filter(
            (event) => event._id.toString() !== eventId
        );

        await project.save();

        res.status(200).json({ msg: "Event deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const getProjectCalendar = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectTracker.findById(projectId).populate("calendar.assignedMembers", "name email");

        if (!project) return res.status(404).json({ msg: "Project not found" });

        res.status(200).json({
            msg: "Calendar fetched successfully",
            events: project.calendar
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const removeMember = async (req, res) => {
    try {
      const { projectId, memberId } = req.body; // memberId = user._id of member to remove
      const userId = req.user; // current logged-in user (leader)
  
      // ✅ Validate
      if (!projectId || !memberId) {
        return res.status(400).json({ msg: "Project ID or Member ID missing." });
      }
  
      // ✅ Fetch project
      const currProject = await ProjectTracker.findById(projectId);
      if (!currProject) {
        return res.status(404).json({ msg: "Project not found." });
      }
  
      // ✅ Only leader can remove members
      if (currProject.leader.toString() !== userId.toString()) {
        return res.status(403).json({
          msg: "Only the project leader can remove members.",
        });
      }
  
      // ✅ Check if member exists in project
      const memberExists = currProject.members.some(
        (m) => m.user.toString() === memberId.toString()
      );
      if (!memberExists) {
        return res.status(400).json({ msg: "Member not found in this project." });
      }
  
      // ✅ Remove the member
      currProject.members = currProject.members.filter(
        (m) => m.user.toString() !== memberId.toString()
      );
  
      // ✅ (Optional) Remove or reassign their tasks
      currProject.tasks = currProject.tasks.filter(
        (task) => task.assignedTo.toString() !== memberId.toString()
      );
  
      await currProject.save();
  
      return res.status(200).json({
        msg: "Member removed successfully.",
        project: currProject,
      });
    } catch (error) {
      console.error("Error removing member:", error);
      return res.status(500).json({
        msg: "Internal Server Error. Could not remove member.",
        error: error.message,
      });
    }
  };

  export const deleteTask = async (req, res) => {
    try {
      const { projectId, taskId } = req.params;
      const userId = req.user; // current user
  
      // ✅ Validate
      if (!projectId || !taskId) {
        return res.status(400).json({ msg: "Project ID or Task ID missing." });
      }
  
      // ✅ Fetch project
      const currProject = await ProjectTracker.findById(projectId);
      if (!currProject) {
        return res.status(404).json({ msg: "Project not found." });
      }
  
      // ✅ Find the task
      const task = currProject.tasks.id(taskId);
      if (!task) {
        return res.status(404).json({ msg: "Task not found." });
      }
  
      // ✅ Only leader or task owner can delete it
      const isLeader = currProject.leader.toString() === userId.toString();
      const isTaskOwner = task.assignedTo.toString() === userId.toString();
  
      if (!isLeader && !isTaskOwner) {
        return res.status(403).json({
          msg: "Access denied. Only leader or assigned user can delete this task.",
        });
      }
  
      // ✅ Remove the task
      currProject.tasks = currProject.tasks.filter(
        (t) => t._id.toString() !== taskId.toString()
      );
  
      await currProject.save();
  
      return res.status(200).json({
        msg: "Task deleted successfully.",
        remainingTasks: currProject.tasks.length,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({
        msg: "Internal Server Error. Could not delete task.",
        error: error.message,
      });
    }
  };
  