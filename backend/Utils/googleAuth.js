import { google } from "googleapis";
import dotenv from "dotenv";
import Workspace from "../models/workspace-model.js";

dotenv.config();

// OAuth Client Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


export const getAuthUrl = (userId) => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    state: userId, 
  });
};


// Get Tokens from Code
export const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};


// 3. Set Credentials
export const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

// 4. Create Event
export const createCalendarEvent = async ({
  accessToken,
  refreshToken,
  title,
  description,
  startDate,
  endDate,
}) => {
  const workspaceId = req.params.id
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  const targetWorkspace = await Workspace.findById(workspaceId)
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const finalDescription = `${description} | workspaceId:${workspaceId}`
  const event = {
    summary: title,
    finalDescription,
    start: {
      dateTime: startDate,
    },
    end: {
      dateTime: endDate,
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  return response.data;
};

// 5. Get Events
export const getCalendarEvents = async ({
  accessToken,
  refreshToken,
}) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const response = await calendar.events.list({
    calendarId: "primary",
  });

  return response.data.items;
};


// 6. Delete Event
export const deleteCalendarEvent = async ({
  accessToken,
  refreshToken,
  eventId,
}) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  await calendar.events.delete({
    calendarId: "primary",
    eventId,
  });

  return { message: "Event deleted" };
};