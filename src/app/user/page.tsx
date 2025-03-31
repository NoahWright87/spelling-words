"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppState } from "../../data/AppState";
import { User } from "../../data/User";
import { UserCard } from "../../components/UserCard";

export default function UserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const isEditMode = searchParams.has("name");

  useEffect(() => {
    if (isEditMode) {
      const appState = AppState.getInstance();
      const existingUser = appState.users.find(u => u.name === searchParams.get("name"));
      if (existingUser) {
        setUser(existingUser);
        setName(existingUser.name);
      }
    } else {
      setUser(new User(""));
      setName("");
    }
  }, [isEditMode, searchParams]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setUser(new User(newName));
  };

  const handleSave = () => {
    if (name.trim()) {
      const appState = AppState.getInstance();
      if (isEditMode) {
        appState.updateUser(user!);
      } else {
        appState.addUser(user!);
      }
      router.push("/");
    } else {
      alert("Name cannot be empty");
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <UserCard
            name={name || undefined}
            onSelect={() => {}}
            showDelete={false}
          />
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter name"
            className="w-full p-3 rounded-lg bg-[var(--background)] text-[var(--foreground)] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button className="button save" onClick={handleSave}>
            Save
          </button>
          <button className="button cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}