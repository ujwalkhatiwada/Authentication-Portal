import React, { useState } from "react";
import { LogOut, ShieldCheck, Mail, Calendar, Laptop, Smartphone, MapPin, Globe, Trash2, Key, History, PlusCircle, Power } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User, DeviceLogin } from "../types";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  type: "info" | "success" | "warning";
}

export default function Dashboard({ user, onLogout, onUpdateUser }: DashboardProps) {
  // Generate mock security logs initialized based on login path
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: "log-1",
      action: `Session authenticated successfully via ${user.isOAuth ? `${user.oauthProvider?.toUpperCase()} OAuth` : "Web Credentials"}`,
      timestamp: new Date().toLocaleTimeString(),
      type: "success"
    },
    {
      id: "log-2",
      action: "Local encrypted session cookie generated",
      timestamp: new Date(Date.now() - 2000).toLocaleTimeString(),
      type: "info"
    },
    {
      id: "log-3",
      action: "Profile clearance check: PASSED",
      timestamp: new Date(Date.now() - 5000).toLocaleTimeString(),
      type: "info"
    }
  ]);

  const [devices, setDevices] = useState<DeviceLogin[]>(user.devices);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [showAddDevice, setShowAddDevice] = useState(false);

  // Terminate a device login session
  const handleTerminateDevice = (deviceId: string) => {
    const targetDevice = devices.find(d => d.id === deviceId);
    if (!targetDevice) return;

    if (targetDevice.isCurrent) {
      // Trying to terminate current session! Warn or prompt logout
      alert("You cannot terminate your current active session. Click 'Log Out' at the top instead.");
      return;
    }

    const updated = devices.filter(d => d.id !== deviceId);
    setDevices(updated);

    // Save back to parent user record
    const updatedUser: User = {
      ...user,
      devices: updated
    };
    onUpdateUser(updatedUser);

    // Append log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action: `Terminated session for device: ${targetDevice.deviceName} (${targetDevice.location})`,
      timestamp: new Date().toLocaleTimeString(),
      type: "warning"
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Simulated adding an authorization device
  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;

    const added: DeviceLogin = {
      id: `device-${Date.now()}`,
      deviceName: newDeviceName.trim(),
      browser: "Mobile App Agent / Safari 18.0",
      ipAddress: `${Math.floor(Math.random() * 200 + 40)}.${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 220 + 2)}.${Math.floor(Math.random() * 250 + 1)}`,
      location: "San Francisco, CA, USA",
      lastActive: "Active 10 seconds ago",
      isCurrent: false
    };

    const updated = [...devices, added];
    setDevices(updated);

    const updatedUser: User = {
      ...user,
      devices: updated
    };
    onUpdateUser(updatedUser);

    setNewDeviceName("");
    setShowAddDevice(false);

    // Add log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action: `Authorized new secondary device: ${added.deviceName}`,
      timestamp: new Date().toLocaleTimeString(),
      type: "success"
    };
    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto py-4">
      {/* Upper Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-brand-input border border-brand-border text-brand-primary rounded-full flex items-center justify-center font-semibold text-lg select-none uppercase">
            {user.name ? user.name.slice(0, 2) : "US"}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-brand-primary tracking-tight">{user.name}</h1>
            <div className="flex items-center gap-1.5 text-xs text-brand-secondary mt-0.5">
              <Mail className="h-3 w-3" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          id="dashboard-logout-btn"
          className="inline-flex items-center gap-2 bg-white hover:bg-brand-input border border-brand-border text-brand-primary font-semibold py-2.5 px-4 rounded-md text-xs transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile and OAuth Status (Column 1) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Identity Information */}
          <div className="glass-panel border border-brand-border rounded-md p-5 shadow-md space-y-4">
            <h2 className="text-xs font-semibold text-brand-secondary uppercase tracking-wider font-sans border-b border-brand-input pb-2.5">
              Security clearance
            </h2>

            {/* Clearance Level status */}
            <div className="p-3 bg-brand-input rounded-md border border-brand-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-brand-primary" />
                <span className="font-semibold text-brand-primary">Account status</span>
              </div>
              <span className="px-2 py-0.5 bg-brand-accent text-white font-bold rounded-md text-[9px]">
                VERIFIED
              </span>
            </div>

            {/* Account Details list */}
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center justify-between text-brand-secondary">
                <span className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5" /> Identity type
                </span>
                <span className="font-mono bg-brand-input text-brand-primary px-2.5 py-0.5 rounded border border-brand-border text-[9px] font-bold">
                  {user.isOAuth ? `${user.oauthProvider?.toUpperCase()} SSO` : "STANDARD"}
                </span>
              </div>

              <div className="flex items-center justify-between text-brand-secondary">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Registered
                </span>
                <span className="font-mono text-brand-primary font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-brand-secondary">
                <span className="flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" /> Current stamp
                </span>
                <span className="font-mono text-brand-primary font-medium">
                  {new Date(user.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Secure Actions Info */}
          <div className="p-5 bg-brand-accent text-white rounded-md space-y-3 relative overflow-hidden">
            {/* Dot Matrix Overlay */}
            <div className="absolute inset-0 bg-dots-dark opacity-15 pointer-events-none" />
            <h3 className="text-sm font-semibold tracking-tight relative z-10">Active Cryptographic Protocol</h3>
            <p className="text-[11px] leading-relaxed opacity-80 relative z-10">
              Your session utilizes transient, secure tokens. Prolonged inactivity triggers automated session tear-down protocols.
            </p>
          </div>
        </div>

        {/* Authorized Terminal Devices and Location Tracking (Column 2 & 3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Devices tracking */}
          <div className="glass-panel border border-brand-border rounded-md p-5 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-brand-primary uppercase tracking-wider font-sans">
                  Active login terminals ({devices.length})
                </h2>
                <p className="text-[11px] text-brand-secondary mt-1 leading-snug">
                  Manage active connections. Terminate unrecognized credentials to flush session access.
                </p>
              </div>
              <button
                onClick={() => setShowAddDevice(!showAddDevice)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent hover:underline transition-colors cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                Add device
              </button>
            </div>

            {/* Quick Add Device Form */}
            <AnimatePresence>
              {showAddDevice && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddDevice}
                  className="bg-brand-input border border-brand-border rounded-md p-4 space-y-3 overflow-hidden text-xs"
                >
                  <p className="font-semibold text-brand-primary text-xs uppercase tracking-wider">Simulate Device Authorization</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. iPad Air, Linux Tower PC"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                      className="flex-1 bg-white border border-brand-border rounded-md py-2 px-3 text-brand-primary placeholder:text-brand-secondary focus:outline-none focus:border-brand-accent"
                    />
                    <button
                      type="submit"
                      className="bg-brand-accent hover:opacity-90 text-white font-semibold px-4 rounded-md cursor-pointer"
                    >
                      Authorize
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Devices List */}
            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`border rounded-md p-4 flex items-start justify-between gap-4 transition-all ${
                    device.isCurrent
                      ? "border-brand-accent bg-brand-input"
                      : "border-brand-border hover:border-brand-accent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md mt-0.5 ${
                      device.isCurrent ? "bg-brand-accent text-white" : "bg-brand-input text-brand-secondary"
                    }`}>
                      {device.deviceName.toLowerCase().includes("mac") || device.deviceName.toLowerCase().includes("windows") || device.deviceName.toLowerCase().includes("pc") ? (
                        <Laptop className="h-4.5 w-4.5" />
                      ) : (
                        <Smartphone className="h-4.5 w-4.5" />
                      )}
                    </div>
                    
                    <div className="space-y-1.5 text-xs text-brand-secondary">
                      <div className="flex items-center gap-2">
                        <strong className="text-brand-primary font-bold">{device.deviceName}</strong>
                        {device.isCurrent && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[8px] font-bold bg-brand-accent text-white font-mono uppercase tracking-wider">
                            <Power className="h-2 w-2" /> CURRENT
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-brand-secondary font-sans leading-relaxed">
                        <span className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-brand-secondary" /> {device.browser}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-brand-secondary" /> {device.location}
                        </span>
                        <span className="sm:col-span-2 text-[10px] font-mono text-brand-secondary/70 mt-0.5">
                          IP: {device.ipAddress} • {device.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!device.isCurrent && (
                    <button
                      onClick={() => handleTerminateDevice(device.id)}
                      title="Terminate Session"
                      className="p-2 text-brand-secondary hover:text-black rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Secure Audit Trails History */}
          <div className="glass-panel border border-brand-border rounded-md p-5 shadow-md space-y-4 pb-6">
            <h2 className="text-xs font-semibold text-brand-primary uppercase tracking-wider font-sans">
              System Audit logs
            </h2>

            <div className="border border-brand-border rounded-md divide-y divide-brand-border overflow-hidden font-mono text-[11px]">
              {logs.map((log) => (
                <div key={log.id} className="p-3 bg-brand-input flex items-center justify-between gap-5 hover:bg-white transition-colors">
                  <div className="flex items-start gap-2 max-w-sm sm:max-w-md">
                    <span className={`inline-block h-2 w-2 rounded-full mt-1.5 flex-shrink-0 bg-brand-accent`} />
                    <span className="text-brand-primary leading-normal">{log.action}</span>
                  </div>
                  <span className="text-brand-secondary text-right shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
