"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Trash2 } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [user]);

  async function handleSaveName() {
    if (!user) return;
    if (firstName === (user.firstName ?? "") && lastName === (user.lastName ?? "")) return;
    setSaving(true);
    try { await user.update({ firstName, lastName }); } catch { /* silent */ }
    finally { setSaving(false); }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!user || !file) return;
    try { await user.setProfileImage({ file }); setAvatarError(false); } catch { /* silent */ }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    try { await user.delete(); router.push("/"); } catch { setDeleting(false); }
  }

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean).join("").toUpperCase() || email[0]?.toUpperCase() || "?";

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <ProfileHeader onBack={() => router.back()} />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-border animate-spin"
            style={{ borderTopColor: "var(--color-primary)" }} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ProfileHeader onBack={() => router.back()} saving={saving} />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-[60px] py-10">
        <div className="w-full max-w-[520px] mx-auto flex flex-col gap-6">

          {/* ── Profile card ── */}
          <div className="border border-border rounded-2xl overflow-hidden">

            {/* Card header: title left, saving indicator right */}
            <div className="flex items-center justify-between px-6 py-5">
              <h1 className="font-display text-[20px] font-normal text-primary">Profile</h1>
              {saving && (
                <span className="font-ui text-[12px] text-muted">Saving…</span>
              )}
            </div>

            {/* Separator */}
            <div className="h-px bg-divider" />

            {/* Card body */}
            <div className="px-6 py-6 flex flex-col gap-6">

              {/* Avatar */}
              <div className="flex justify-center">
                <div className="relative">
                  {user?.imageUrl && !avatarError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.imageUrl}
                      alt="Profile picture"
                      width={80}
                      height={80}
                      className="rounded-full object-cover w-20 h-20"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-ui text-[22px] font-medium text-secondary">
                      {initials}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change profile picture"
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center hover:bg-line transition-colors duration-150"
                  >
                    <Camera className="w-3.5 h-3.5 text-secondary" strokeWidth={1.5} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-ui text-[11px] font-medium text-muted uppercase tracking-widest">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={handleSaveName}
                    placeholder="First name"
                    className="bg-surface border border-border rounded-xl px-4 py-3 font-ui text-[14px] text-primary placeholder:text-muted outline-none focus:border-muted transition-colors duration-150"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-ui text-[11px] font-medium text-muted uppercase tracking-widest">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={handleSaveName}
                    placeholder="Last name"
                    className="bg-surface border border-border rounded-xl px-4 py-3 font-ui text-[14px] text-primary placeholder:text-muted outline-none focus:border-muted transition-colors duration-150"
                  />
                </div>
              </div>

              {/* Email — read only */}
              <div className="flex flex-col gap-2">
                <label className="font-ui text-[11px] font-medium text-muted uppercase tracking-widest">Email address</label>
                <div className="bg-surface border border-border rounded-xl px-4 py-3 font-ui text-[14px] text-secondary cursor-default select-all">
                  {email}
                </div>
              </div>

            </div>
          </div>

          {/* ── Danger zone card ── */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-5">
              <h2 className="font-display text-[16px] font-normal text-primary">Delete account</h2>
            </div>
            <div className="h-px bg-divider" />
            <div className="px-6 py-6 flex flex-col gap-4">
              <p className="font-ui text-[13px] text-muted leading-[1.5]">
                Permanently removes your account and all associated data. This cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="self-start flex items-center gap-2 font-ui text-[13px] text-muted border border-border rounded-xl px-4 py-2.5 hover:text-[#f87171] hover:border-[#f87171]/40 transition-colors duration-150"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Delete account
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="font-ui text-[13px] text-secondary leading-[1.5]">
                    Are you sure? This will permanently delete your account and all your history.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="font-ui text-[13px] font-medium text-white bg-[#c0392b] rounded-xl px-4 py-2.5 hover:bg-[#a93226] transition-colors duration-150 disabled:opacity-50"
                    >
                      {deleting ? "Deleting…" : "Yes, delete my account"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="font-ui text-[13px] text-muted hover:text-secondary transition-colors duration-150"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ─── Header ─────────────────────────────────────── */
function ProfileHeader({ onBack, saving }: { onBack: () => void; saving?: boolean }) {
  const router = useRouter();
  return (
    <header className="w-full border-b border-line shrink-0">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-[60px] h-16 md:h-24 flex items-center justify-between">

        {/* Left: back + logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-ui text-[14px] text-secondary hover:text-primary transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back
          </button>
          <div className="w-px h-4 bg-line" />
          <button
            onClick={() => router.push("/")}
            className="font-display text-2xl font-light text-white tracking-tight hover:opacity-80 transition-opacity duration-150"
          >
            Clarity.ai
          </button>
        </div>

        {/* Right: saving hint */}
        {saving && (
          <span className="font-ui text-[12px] text-muted">Saving…</span>
        )}
      </div>
    </header>
  );
}
