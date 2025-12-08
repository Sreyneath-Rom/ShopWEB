// components/FloatingTabBar.tsx
export function FloatingTabBar({ current, onChange }: { current: string; onChange: (v: string) => void }) {
  const tabs = [
    { id: "home", icon: "house.fill", label: "Home" },
    { id: "search", icon: "magnifyingglass", label: "Search" },
    { id: "cart", icon: "cart.fill", label: "Cart" },
    { id: "profile", icon: "person.crop.circle.fill", label: "Profile" },
  ];

  return (
    <div className="fixed inset-x-4 bottom-8 z-50">
      <div className="relative mx-auto max-w-md">
        <div className="frosted rounded-full p-3 shadow-2xl backdrop-blur-3xl border border-white/40">
          <div className="flex justify-around items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative p-4 rounded-full transition-all ${current === tab.id ? "text-ios-accent" : "text-gray-500"}`}
              >
                <div className="relative">
                  <SFIcon name={tab.icon} weight={current === tab.id ? "bold" : "regular"} className="w-7 h-7" />
                  {current === tab.id && (
                    <m.div
                      layoutId="tabIndicator"
                      className="absolute inset-0 bg-ios-accent/20 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}