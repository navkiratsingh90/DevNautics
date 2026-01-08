


"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleTheme } from "../Features/ThemeSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const WorkExperience = () => {
  const darkMode = useSelector((state) => state.Theme.darkMode);
  const user = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    duration: "",
    location: "",
    description: "",
    certifications: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExperience = {
      id: experiences.length + 1,
      company: formData.company,
      role: formData.role,
      duration: formData.duration,
      location: formData.location,
      description: formData.description,
      certifications: formData.certifications.split(",").map((cert) => {
        const [name, issuer] = cert.split("|");
        return { name: name.trim(), issuer: issuer?.trim() || "Issuer" };
      }),
      logo: "⭐",
    };

    setExperiences([...experiences, newExperience]);
    setFormData({ company: "", role: "", duration: "", location: "", description: "", certifications: "" });
    setShowForm(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[var(--color-darkBlue)]" : "bg-[var(--color-white)]"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
          <div>
            <h1 className={`text-3xl sm:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              Work Experience
            </h1>
            <p className={`mt-2 text-base sm:text-lg ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              Professional journey and achievements
            </p>
          </div>
          <Button
            onClick={() => dispatch(handleTheme())}
            variant="outline"
            className={darkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800"}
          >
            {darkMode ? "🌞" : "🌙"}
          </Button>
        </header>

        {/* Timeline */}
        <div className="relative">
          <div
            className={`absolute left-4 sm:left-6 top-0 h-full w-1 ${darkMode ? "bg-blue-700" : "bg-blue-300"} -z-10`}
          />
          {user.workExperience.map((exp, index) => (
            <div key={exp.id} className=" flex flex-col sm:flex-row mb-12 sm:ml-4 gap-4">
              {/* Timeline indicator */}
              <div className="flex-shrink-0 flex items-center justify-center sm:mr-6">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                    darkMode ? "bg-blue-700" : "bg-blue-600"
                  } text-white text-lg`}
                >
                  w
                </div>
              </div>

              {/* Content */}
              <Card className={`border-0 flex-1 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold">{exp.company}</h2>
                      <p className="text-blue-500 text-xl font-medium">{exp.role}</p>
                    </div>
                    <div className="text-sm text-gray-400 text-right">
                      <p className="font-medium">{exp.duration}</p>
                      <p className="text-xs sm:text-sm">{exp.location}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base mt-2">{exp.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Add Experience */}
        <div className="mb-12 flex justify-center">
          <Card
            onClick={() => setShowForm(true)}
            className={`cursor-pointer border-dashed border-2 w-full max-w-md flex flex-col items-center justify-center p-6 sm:p-8 hover:scale-105 transition ${
              darkMode ? "border-blue-700 hover:bg-blue-900/20" : "border-blue-400 hover:bg-blue-50"
            }`}
          >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${darkMode ? "bg-blue-800" : "bg-blue-100"}`}>
              <span className={`text-lg sm:text-2xl ${darkMode ? "text-blue-300" : "text-blue-600"}`}>+</span>
            </div>
            <h3 className={`text-lg sm:text-xl font-semibold ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
              Add Work Experience
            </h3>
            <p className={`mt-1 text-center text-sm sm:text-base ${darkMode ? "text-blue-400" : "text-blue-500"}`}>
              Click here to add a new work experience to your profile
            </p>
          </Card>
        </div>
      </div>

      {/* Form Modal (Dialog) */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className={darkMode ? "bg-gray-800 text-white" : "bg-white"}>
          <DialogHeader>
            <DialogTitle>Add Work Experience</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Company" name="company" value={formData.company} onChange={handleInputChange} />
            <Input placeholder="Role" name="role" value={formData.role} onChange={handleInputChange} />
            <Input placeholder="Duration" name="duration" value={formData.duration} onChange={handleInputChange} />
            <Input placeholder="Location" name="location" value={formData.location} onChange={handleInputChange} />
            <Textarea placeholder="Description" name="description" value={formData.description} onChange={handleInputChange} />
            <Input
              placeholder="Certifications (name|issuer, name|issuer)"
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Experience</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkExperience;
