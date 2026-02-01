import ProjectCollab from "../models/collabspace-model.js";
import requestCollabModel from "../models/requestCollab-model.js";
// import requestCollab from "../models/requestCollab-model.js";

export const createNewProjectCollaboration = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            problemStatement,
            rolesLookingFor,
            techStackUsed,
            totalTeamSize,
            currentTeamMembers,
        } = req.body;
        if (
            !title ||
            !description ||
            !status ||
            !problemStatement ||
            !rolesLookingFor ||
            !techStackUsed ||
            !totalTeamSize
        ) {
            res.status(400).send({ msg: "invalid Credentials!" });
        }
        const userId = req.user.userID || req.user._id;
        for (let member of currentTeamMembers) {
            if (!member.user || !member.roleAssigned) {
                return res.status(400).json({
                    message:
                        "Each team member must have 'user' and 'roleAssigned' fields",
                });
            }
        }
        if (currentTeamMembers.length > totalTeamSize) {
            return res.status(400).json({
                message: "Team size exceeds totalTeamSize of the project",
            });
        }
        const exists = currentTeamMembers.some(
            member => member.user.toString() === userId.toString()
        );
        
        if (!exists) {
            currentTeamMembers.push({
                user: userId,
                roleAssigned: "Project Owner" // or any role
            });
        }
        
        const newProject = new ProjectCollab({
            title,
            description,
            status,
            problemStatement,
            rolesLookingFor,
            techStackUsed,
            totalTeamSize,
            currentTeamMembers,
            createdBy: userId,
        });

        await newProject.save();

        res.status(201).json({
            message: "Project collaboration created successfully",
            project: newProject,
        });
    } catch (error) {
        console.error(error);
    }
};

export const updateCurrentProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, status, rolesLookingFor, currentTeamMembers } =
            req.body;
            const userId = req.user.userID || req.user._id;
        const project = await ProjectCollab.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (project.createdBy.toString() != userId) return res.status(404).json({ message: "you're not owner of the post" });
        if (currentTeamMembers) {
            for (let member of currentTeamMembers) {
                const existingMember = project.currentTeamMembers.some(
                    (m) => member.user.toString() === m.user.toString()
                );

                if (existingMember) {
                    return res
                        .status(400)
                        .json({ msg: "User already exists in this team" });
                }
            }

            const userIds = currentTeamMembers.map((m) => m.user.toString());
            const hasDuplicates = new Set(userIds).size !== userIds.length;
            if (hasDuplicates) {
                return res.status(400).json({
                    message: "Duplicate users found in currentTeamMembers",
                });
            }

            if (currentTeamMembers.length > project.totalTeamSize) {
                return res.status(400).json({
                    message: "Team size exceeds totalTeamSize of the project",
                });
            }
        }

        if (description) project.description = description;
        if (status) project.status = status;
        if (rolesLookingFor) {
            for (let roles of rolesLookingFor) {
                project.rolesLookingFor.push(roles);
            }
        }
        if (currentTeamMembers) {
            for (let members of currentTeamMembers) {
                project.currentTeamMembers.push(members);
            }
        }

        // 5️⃣ Save updated project
        const updatedProject = await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({
            message: "Internal server error while updating project",
            error: error.message,
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
        const sortObj = { [sort]: sortOrder };

        // Query DB
        const projects = await ProjectCollab.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "username email profilePic")
            .populate("currentTeamMembers.user", "username email profilePic");

        // Pagination info
        const totalProjects = await ProjectCollab.countDocuments(query);
        const totalPages = Math.ceil(totalProjects / limit);

        res.status(200).json({
            message: "Projects retrieved successfully",
            data: projects,
            pagination: {
                totalProjects,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
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

export const requestForCollaboration = async (req, res) => {
    try {
        const projectId = req.params.id; // Correct param
        const userId = req.user.userID || req.user._id
        // console.log(userId);
        const { email, message, githubLink, resume, experience, rolesApplied } =
            req.body;

        if (!email || !message || !resume || !experience || !rolesApplied) {
            return res
                .status(400)
                .json({ message: "All fields are required." });
        }

        const project = await ProjectCollab.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        const invalidRoles = rolesApplied.filter(
            (role) => !project.rolesLookingFor.includes(role)
        );
        if (invalidRoles.length > 0) {
            return res.status(400).json({
                message: `Invalid roles applied: ${invalidRoles.join(", ")}`,
            });
        }

        const newRequest = await requestCollabModel.create({
            email,
            message,
            resume,
            experience,
            rolesApplied,
            githubLink: githubLink || null,
            projectReffered: projectId,
            createdBy: userId,
        });
        const updatedProject = await ProjectCollab.findByIdAndUpdate(
            projectId,
            {
                $push: {
                    pendingRequests: newRequest._id,
                },
            }
        );
        return res.status(201).json({
            message: "Collaboration request submitted successfully.",
            data: newRequest,
        });
    } catch (error) {
        console.error("Error creating collaboration request:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message,
        });
    }
};

export const acceptApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        // const { rolesAssigned } = req.body;
        const userId = req.user.userID || req.user._id
        if (!applicationId) {
            return res
                .status(400)
                .json({
                    message: "Application ID and rolesAssigned are required.",
                });
        }

        const application = await requestCollabModel.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found." });
        }

        const project = await ProjectCollab.findById(
            application.projectReffered
        );
        if (!project) {
            return res
                .status(404)
                .json({ message: "Associated project not found." });
        }

        if (userId.toString() !== project.createdBy.toString()) {
            return res
                .status(403)
                .json({
                    message:
                        "You are not authorized to accept applications for this project."
                });
        }

        // const invalidRoles = project.rolesAssigned.filter(
        //     (role) => !project.rolesLookingFor.includes(role)
        // );
        // if (invalidRoles.length > 0) {
        //     return res.status(400).json({
        //         message: `Invalid role(s) assigned: ${invalidRoles.join(", ")}`,
        //     });
        // }
        let Roles = "";

        for (let role of application.rolesApplied) {
            Roles += role + ", ";
        }
        Roles = Roles.slice(0, -2);
        const acceptedMember = {
            user: application.createdBy,
            roleAssigned: Roles,
        };

        const updatedProject = await ProjectCollab.findByIdAndUpdate(
            project._id,
            {
                $push: { currentTeamMembers: acceptedMember },
                $pull: { pendingRequests: application._id },
            },
            { new: true }
        );

        await requestCollabModel.findByIdAndDelete(applicationId);

        return res.status(200).json({
            message: "Application accepted successfully.",
            projectId: updatedProject._id,
            addedMember: acceptedMember,
            currentTeamSize: updatedProject.currentTeamMembers.length,
        });
    } catch (error) {
        console.error("Error accepting application:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message,
        });
    }
};
