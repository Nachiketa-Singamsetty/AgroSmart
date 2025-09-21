import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-irrigation-green">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <Button asChild className="bg-irrigation-green hover:bg-irrigation-green/90">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
