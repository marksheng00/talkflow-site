import { useTranslations } from "next-intl";
import { categories, Category, BugPlatform } from "@/types/roadmap";
import { Tab } from "../hooks/use-roadmap-state";

interface FilterBarProps {
    activeTab: Tab;
    selectedCategory: Category;
    setSelectedCategory: (category: Category) => void;
    selectedPlatform: BugPlatform | "All";
    setSelectedPlatform: (platform: BugPlatform | "All") => void;
}

export function FilterBar({
    activeTab,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
}: FilterBarProps) {
    const t = useTranslations('RoadmapPage');

    if (activeTab === "bugs") {
        return (
            <div className="flex gap-1.5 md:gap-2 w-full md:w-auto justify-center md:justify-end">
                {(["All", "iOS", "Android", "Web"] as const).map(p => {
                    const isActive = selectedPlatform === p;
                    const platformColors = {
                        All: { active: 'bg-slate-500/20 border-slate-500/50 text-slate-300', hover: 'hover:border-slate-500/30' },
                        Web: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                        iOS: "bg-rose-500/20 text-rose-400 border-rose-500/30",
                        Android: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                    };
                    const colors = platformColors[p] || platformColors.All;

                    return (
                        <button
                            key={p}
                            onClick={() => setSelectedPlatform(p)}
                            className={`flex-1 md:flex-initial px-3 md:px-4 py-1.5 rounded-xl text-[10px] md:text-xs font-semibold border transition-all text-center whitespace-nowrap ${isActive
                                ? (typeof colors === 'string' ? colors : colors.active)
                                : `bg-transparent border-white/10 text-slate-500 ${typeof colors === 'string' ? '' : colors.hover} hover:text-slate-300`
                                }`}
                        >
                            {t(`Filters.Platforms.${p}`)}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="flex gap-1.5 md:gap-2 w-full md:w-auto justify-center md:justify-end">
            {categories.map(cat => {
                const categoryButtonColors = {
                    All: { active: 'bg-slate-500/20 border-slate-500/50 text-slate-300', hover: 'hover:border-slate-500/30' },
                    "Feature": "bg-blue-500/20 text-blue-400 border-blue-500/30",
                    "Content": "bg-purple-500/20 text-purple-400 border-purple-500/30",
                    "AI Core": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                    "UIUX": "bg-amber-500/20 text-amber-400 border-amber-500/30",
                    "Bug": "bg-rose-500/20 text-rose-400 border-rose-500/30",
                };

                const buttonColor = categoryButtonColors[cat as keyof typeof categoryButtonColors] || categoryButtonColors.All;

                return (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex-1 md:flex-initial px-2 md:px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-semibold border transition-all text-center whitespace-nowrap ${selectedCategory === cat
                            ? (typeof buttonColor === 'string' ? buttonColor : buttonColor.active)
                            : `bg-transparent border-white/10 text-slate-500 ${typeof buttonColor === 'string' ? '' : buttonColor.hover} hover:text-slate-300`
                            }`}
                    >
                        {t(`Filters.Categories.${cat}`)}
                    </button>
                );
            })}
        </div>
    );
}
