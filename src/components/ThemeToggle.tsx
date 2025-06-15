
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  collapsed?: boolean;
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className={`${collapsed ? 'w-10 h-10 p-0 justify-center' : 'w-full justify-start'}`}
      title="Toggle theme"
    >
      <div className={`relative h-4 w-4 ${!collapsed ? 'mr-3' : ''}`}>
        <Sun className="absolute h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      {!collapsed && (
        <span>Toggle Theme</span>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
