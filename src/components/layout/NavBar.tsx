import React from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Shield } from "lucide-react";
import Badge from "../tasks/Badge";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../sidebar/DropdownMenu"; // ← updated import
import { Avatar } from "../sidebar/Avatar"; // ← simplified avatar import

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <nav className="bg-[var(--bg-paper)] border-b border-[var(--border-color)] sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* --- Brand --- */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">T</span>
            </div>
            <h1 className="text-[var(--text-primary)] text-base font-medium">TaskFlow</h1>
          </div>

          {/* --- Right Section --- */}
          <div className="flex items-center gap-4">
            {user && (
              <DropdownMenu
                triggerLabel={
                  <button className="flex items-center gap-3 hover:bg-[var(--bg-hover)] rounded-lg p-2 transition-colors">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm text-[var(--text-primary)] font-medium">
                        {user.firstName}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                    </div>
                    <Avatar
                      src={user.avatarUrl}
                      alt={user.firstName}
                      fallback={getInitials(user.firstName)}
                      className="w-9 h-9"
                    />
                  </button>
                }
              >
                {/* --- Dropdown Menu Content --- */}
                <div className="mt-2 w-56 rounded-md bg-white border border-gray-200 shadow-md absolute right-0">
                  <DropdownMenuLabel>
                    <div className="flex items-center justify-between">
                      <span>My Account</span>
                      {user.role === "admin" && (
                        <Badge className="bg-[var(--color-primary)] text-white flex items-center gap-1 px-2 py-0.5 text-xs rounded-md">
                          <Shield className="w-3 h-3" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem label="Logout" onClick={logout} variant="destructive" />
                  </DropdownMenuGroup>
                </div>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
