import React from "react";
import { Users, Shield, Code, UserCircle, Briefcase, Activity } from "lucide-react";

export const Team = () => {
  // Mock data for display, can be connected to react-query later
  const members = [
    { id: 1, name: "Jane Doe", role: "Admin", email: "jane@example.com", skills: "React, Node.js", workload: 80 },
    { id: 2, name: "John Smith", role: "Developer", email: "john@example.com", skills: "Python, SQL", workload: 60 },
    { id: 3, name: "Alice Johnson", role: "Designer", email: "alice@example.com", skills: "Figma, UI/UX", workload: 45 },
    { id: 4, name: "Bob Wilson", role: "Project Manager", email: "bob@example.com", skills: "Agile, Jira", workload: 90 },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin": return <Shield className="w-4 h-4 text-rose-500" />;
      case "Developer": return <Code className="w-4 h-4 text-blue-500" />;
      case "Designer": return <Briefcase className="w-4 h-4 text-pink-500" />;
      case "Project Manager": return <Activity className="w-4 h-4 text-emerald-500" />;
      default: return <UserCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage team members, roles, and monitor workloads.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-primary/25 hover:bg-primary/90 transition-all">
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Members</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Average Workload</h3>
          <p className="text-3xl font-bold mt-2">68%</p>
        </div>
        <div className="p-6 bg-card border rounded-2xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Overloaded Members</h3>
          <p className="text-3xl font-bold mt-2 text-rose-500">2</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Member</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Skills</th>
              <th className="px-6 py-4 font-medium">Workload</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(member.role)}
                    <span>{member.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {member.skills}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${member.workload > 85 ? 'bg-rose-500' : 'bg-primary'}`}
                        style={{ width: `${member.workload}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{member.workload}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary text-sm hover:underline font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
