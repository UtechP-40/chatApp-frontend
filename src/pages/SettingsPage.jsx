import React from "react";
import { Moon,Languages, Users, Lock, Bell, Download, HelpCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
{/* <Languages /> */}
  const options = [
    {
      title: "Themes",
      description: "Customize the look and feel of the app.",
      icon: <Moon className="text-primary" />,
      route: "/settings/theme",
    },
    {
      title: "Language",
      description: "Customize your language prefrence.",
      icon: <Languages className="text-primary" />,
      route: "/settings/language",
    },
    // {
    //   title: "Manage Friends",
    //   description: "View and manage your friends list.",
    //   icon: <Users className="text-primary" />,
    //   route: "/settings/friends",
    // },
    {
      title: "Privacy Settings",
      description: "Control your privacy preferences.",
      icon: <Lock className="text-primary" />,
      route: "/settings/privacy",
    },
    {
      title: "Notifications",
      description: "Set up your notification preferences.",
      icon: <Bell className="text-primary" />,
      route: "/settings/notifications",
    },
    {
      title: "Download Data",
      description: "Request a copy of your personal data.",
      icon: <Download className="text-primary" />,
      route: "/settings/download-data",
    },
    {
      title: "Help & Support",
      description: "Access FAQs or contact support.",
      icon: <HelpCircle className="text-primary" />,
      route: "/settings/help",
    },
    {
      title: "Accessibility",
      description: "Adjust settings for better accessibility.",
      icon: <Eye className="text-primary" />,
      route: "/settings/accessibility",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Settings Options */}
      <div className="w-full max-w-3xl space-y-4">
        {options.map((option, index) => (
          <section
            key={index}
            className="w-full bg-base-100 rounded-lg shadow-lg p-6 cursor-pointer hover:bg-primary/5 transition"
            onClick={() => navigate(option.route)}
          >
            <h2 className="text-lg font-semibold hover:text-primary mb-2 flex items-center gap-2">
              {option.icon}
              {option.title}
            </h2>
            <p className="text-sm text-gray-500">{option.description}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
