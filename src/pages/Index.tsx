import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Charts } from "@/components/Charts";
import { Reports } from "@/components/Reports";
import { Settings } from "@/components/Settings";
import { AuthWrapper } from "@/components/AuthWrapper";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = async () => {
    try {
      await signOut();
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return <AuthWrapper />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "charts":
        return <Charts />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={{
          displayName: user.displayName,
          email: user.email,
          name: user.displayName
        }}
        onLogout={handleLogout}
      />
      {renderContent()}
    </div>
  );
};

export default Index;
