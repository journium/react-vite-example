import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        </div>
        <Button asChild>
          <Link to="/home">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
