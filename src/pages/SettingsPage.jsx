import React from "react";
import { Moon, Languages, Users, Lock, Bell, Download, HelpCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const options = [
    {
      title: t("settings.themes.title"),
      description: t("settings.themes.description"),
      icon: <Moon className="text-primary" />,
      route: "/settings/theme",
    },
    {
      title: t("settings.language.title"),
      description: t("settings.language.description"),
      icon: <Languages className="text-primary" />,
      route: "/settings/language",
    },
    {
      title: t("settings.privacy.title"),
      description: t("settings.privacy.description"),
      icon: <Lock className="text-primary" />,
      route: "/settings/privacy",
    },
    {
      title: t("settings.notifications.title"),
      description: t("settings.notifications.description"),
      icon: <Bell className="text-primary" />,
      route: "/settings/notifications",
    },
    {
      title: t("settings.download.title"),
      description: t("settings.download.description"),
      icon: <Download className="text-primary" />,
      route: "/settings/download-data",
    },
    {
      title: t("settings.help.title"),
      description: t("settings.help.description"),
      icon: <HelpCircle className="text-primary" />,
      route: "/settings/help",
    },
    {
      title: t("settings.accessibility.title"),
      description: t("settings.accessibility.description"),
      icon: <Eye className="text-primary" />,
      route: "/settings/accessibility",
    },
  ];
  console.clear()
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>

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

export default Settings;
