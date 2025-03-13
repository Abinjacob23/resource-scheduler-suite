
import { useState } from 'react';
import { Bell, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="dashboard-header animate-fade-in">
      <div className="flex items-center">
        <div className={cn(
          "relative flex items-center transition-all duration-300 ease-in-out",
          searchFocused ? "w-96" : "w-64"
        )}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-full rounded-full bg-muted/30 border border-border px-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="h-9 w-9 rounded-full flex items-center justify-center bg-muted/30 hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-foreground/80" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="text-sm font-medium">Admin User</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
