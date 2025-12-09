// app/components/ui/AccountHeader.tsx
interface Props {
  user: string;
  activeScreen: "profile" | "admin";
  onBack: () => void;
  goProfile: () => void;
  goAdmin: () => void;
}

export default function AccountHeader({ user, activeScreen, onBack, goProfile, goAdmin }: Props) {
  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-md text-sm bg-slate-100" onClick={onBack}>
            Back to shop
          </button>

          <button
            className={`px-3 py-1 rounded-md text-sm ${
              activeScreen === "profile" ? "bg-slate-200" : "bg-white"
            }`}
            onClick={goProfile}
          >
            Profile
          </button>

          <button
            className={`px-3 py-1 rounded-md text-sm ${
              activeScreen === "admin" ? "bg-slate-200" : "bg-white"
            }`}
            onClick={goAdmin}
          >
            Orders / Admin
          </button>
        </div>

        <div className="text-sm text-slate-500">Signed in as {user}</div>
      </div>
    </div>
  );
}
