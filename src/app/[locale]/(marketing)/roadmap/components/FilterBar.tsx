import { useTranslations } from "next-intl";
import { categories, Category, BugPlatform } from "@/types/roadmap";
import { Tab } from "../hooks/use-roadmap-state";
import { getToggleButtonStyle } from "@/components/ui/Tabs";

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
            <div className="flex gap-1 w-full md:w-auto justify-center md:justify-end">
                {(["All", "iOS", "Android", "Web"] as const).map(p => {
                    const isActive = selectedPlatform === p;

                    return (
                        <button
                            key={p}
                            onClick={() => setSelectedPlatform(p)}
                            className={getToggleButtonStyle(isActive)}
                        >
                            {t.has(`Filters.Platforms.${p}`) ? t(`Filters.Platforms.${p}`) : p}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="flex gap-1 w-full md:w-auto justify-center md:justify-end">
            {categories.map(cat => {
                return (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={getToggleButtonStyle(selectedCategory === cat)}
                    >
                        {t.has(`Filters.Categories.${cat}`) ? t(`Filters.Categories.${cat}`) : cat}
                    </button>
                );
            })}
        </div>
    );
}
