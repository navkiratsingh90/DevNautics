"use client";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleTheme } from "../Features/ThemeSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock,
  Code,
  Coffee,
  Database,
  GitBranch,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const COLORS = ["#38bdf8", "#60a5fa", "#93c5fd", "#2563eb", "#1d4ed8"];

const Analytics = () => {
  const darkMode = useSelector((state) => state.Theme.darkMode);
  const dispatch = useDispatch();

  // ---------- DUMMY DATA ----------
  const stats = useMemo(() => {
    return {
      // Overview cards
      totalActivities: 42,
      totalChallenges: 18,
      totalPoints: 1250,
      activeWorkspaces: 3,
      totalConnections: 86,

      // Activity over last 7 days
      activityTimeline: [
        { day: "Mon", activities: 2 },
        { day: "Tue", activities: 4 },
        { day: "Wed", activities: 3 },
        { day: "Thu", activities: 5 },
        { day: "Fri", activities: 7 },
        { day: "Sat", activities: 4 },
        { day: "Sun", activities: 2 },
      ],

      // Challenges by type
      challengeByType: [
        { type: "Coding", count: 8 },
        { type: "MCQ", count: 5 },
        { type: "Aptitude", count: 3 },
        { type: "Puzzle", count: 2 },
      ],

      // Workspace task distribution
      workspaceTasks: [
        { name: "Completed", value: 12, color: "#22c55e" },
        { name: "In Progress", value: 8, color: "#eab308" },
        { name: "Pending", value: 5, color: "#ef4444" },
      ],

      // Engagement received
      engagementData: [
        { name: "Likes", value: 142, icon: Heart },
        { name: "Comments", value: 37, icon: MessageCircle },
        { name: "Shares", value: 28, icon: Share2 },
      ],

      // Skill proficiency (radar chart)
      skillsRadar: [
        { skill: "React", value: 90 },
        { skill: "JavaScript", value: 85 },
        { skill: "Node.js", value: 75 },
        { skill: "Python", value: 60 },
        { skill: "CSS", value: 80 },
        { skill: "MongoDB", value: 70 },
      ],

      // Recent achievements
      recentAchievements: [
        { id: "ach1", title: "Completed 5 Coding Challenges", date: "2 days ago", icon: Code },
        { id: "ach2", title: "Earned 'Problem Solver' Badge", date: "5 days ago", icon: Award },
        { id: "ach3", title: "Joined AI Project Workspace", date: "1 week ago", icon: Briefcase },
        { id: "ach4", title: "Reached 1000 Points", date: "1 week ago", icon: Star },
      ],

      // Project contributions
      projectContributions: [
        { project: "E‑Commerce Platform", commits: 24, lines: 1200 },
        { project: "Portfolio Website", commits: 12, lines: 800 },
        { project: "Open Source Lib", commits: 8, lines: 450 },
      ],

      // Top collaborators
      topCollaborators: [
        { name: "Sarah Chen", username: "@sarahc", contributions: 15, avatar: "SC" },
        { name: "Mike Johnson", username: "@mikej", contributions: 12, avatar: "MJ" },
        { name: "Priya Patel", username: "@priyap", contributions: 10, avatar: "PP" },
      ],

      // Weekly progress (simple)
      weeklyProgress: 68, // percentage
    };
  }, []);

  // Helper to render trend indicator (could be dynamic)
  const renderTrend = (value) => (
    <span className="inline-flex items-center text-xs text-green-500 ml-2">
      <TrendingUp className="w-3 h-3 mr-0.5" /> {value}%
    </span>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[var(--color-darkBlue)]" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Analytics Dashboard
            </h1>
            <p className={`mt-1 text-base sm:text-lg ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              Track your performance and engagement
            </p>
          </div>
          <Button
            onClick={() => dispatch(handleTheme())}
            variant="outline"
            className={darkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800"}
          >
            {darkMode ? "☀️" : "🌙"}
          </Button>
        </header>

        {/* Overview Cards with Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Activities</CardTitle>
              <Activity className="w-5 h-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities}</div>
              <p className="text-xs text-green-500 flex items-center">+12% from last week</p>
            </CardContent>
          </Card>
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Challenges</CardTitle>
              <Target className="w-5 h-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChallenges}</div>
              <p className="text-xs text-green-500 flex items-center">+2 new this month</p>
            </CardContent>
          </Card>
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Total Points</CardTitle>
              <Award className="w-5 h-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPoints}</div>
              <p className="text-xs text-green-500 flex items-center">Top 10% of users</p>
            </CardContent>
          </Card>
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Workspaces</CardTitle>
              <Briefcase className="w-5 h-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeWorkspaces}</div>
              <p className="text-xs text-blue-400 flex items-center">2 have pending tasks</p>
            </CardContent>
          </Card>
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Connections</CardTitle>
              <Users className="w-5 h-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConnections}</div>
              <p className="text-xs text-green-500 flex items-center">+5 new this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          {/* Activity Timeline */}
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" /> Activity Timeline (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.activityTimeline} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="day" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#fff",
                      borderColor: darkMode ? "#374151" : "#e5e7eb",
                      color: darkMode ? "#fff" : "#000",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="activities" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skills Radar
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" /> Skill Proficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={stats.skillsRadar}>
                  <PolarGrid stroke={darkMode ? "#4b5563" : "#d1d5db"} />
                  <PolarAngleAxis dataKey="skill" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <Radar name="Skills" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.5} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#fff",
                      borderColor: darkMode ? "#374151" : "#e5e7eb",
                      color: darkMode ? "#fff" : "#000",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Challenge Types */}
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" /> Challenges by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.challengeByType} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="type" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#fff",
                      borderColor: darkMode ? "#374151" : "#e5e7eb",
                      color: darkMode ? "#fff" : "#000",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Workspace Tasks Pie */}
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Workspace Tasks Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.workspaceTasks}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.workspaceTasks.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#fff",
                      borderColor: darkMode ? "#374151" : "#e5e7eb",
                      color: darkMode ? "#fff" : "#000",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Sections (3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Engagement Stats */}
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" /> Engagement Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.engagementData.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-blue-400" />
                        <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{item.name}</span>
                      </div>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" /> +8% from last month
              </div>
            </CardContent>
          </Card>

          {/* Project Contributions */}
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" /> Project Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.projectContributions.map((proj, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{proj.project}</p>
                      <p className="text-xs text-gray-400">{proj.commits} commits · {proj.lines} lines</p>
                    </div>
                    <Badge variant="outline" className={darkMode ? "border-blue-700 text-blue-400" : "border-blue-300 text-blue-600"}>
                      {proj.commits}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Collaborators */}
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" /> Top Collaborators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topCollaborators.map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{user.name}</p>
                      <p className="text-xs text-gray-400">{user.username}</p>
                    </div>
                    <Badge variant="secondary" className={darkMode ? "bg-gray-700 text-blue-400" : "bg-blue-50 text-blue-600"}>
                      {user.contributions}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress + Recent Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Weekly Progress Card */}
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" /> Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">This week's goal</span>
                <span className="font-bold">{stats.weeklyProgress}%</span>
              </div>
              <Progress value={stats.weeklyProgress} className="h-3" />
              <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-500" /> 5 days streak! Keep it up.
              </p>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className={`border-0 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" /> Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentAchievements.map((ach) => {
                  const Icon = ach.icon;
                  return (
                    <div key={ach.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{ach.title}</p>
                        <p className="text-xs text-gray-400">{ach.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer note (optional) */}
        <div className="text-center mt-6">
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
            Last updated: just now · Data refreshes every hour
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;