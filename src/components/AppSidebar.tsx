import { LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Report", url: "/report", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-6">
            {open && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                  <span className="text-background font-bold text-sm">LP</span>
                </div>
                <SidebarGroupLabel className="text-lg font-bold">LinkedIn PM</SidebarGroupLabel>
              </div>
            )}
            {!open && (
              <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center mx-auto">
                <span className="text-background font-bold text-sm">LP</span>
              </div>
            )}
            <SidebarTrigger className="ml-auto" />
          </div>

          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-sidebar-accent transition-all duration-200"
                      activeClassName="bg-primary text-primary-foreground font-semibold shadow-sf-sm"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button
            variant="outline"
            onClick={logout}
            className="w-full justify-start gap-3 text-sidebar-foreground border-sidebar-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {open && <span>Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
