import { useTranslations } from "next-intl";
import { Tab } from "../hooks/use-roadmap-state";

interface TabSwitcherProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export function TabSwitcher({ activeTab, setActiveTab }: TabSwitcherProps) {
    const t = useTranslations('RoadmapPage');

    return (
        <div className="flex p-1 stack-tight md:gap-1 rounded-xl bg-white/5 border border-white/5 w-full md:w-fit">
            <button
                onClick={() => setActiveTab("roadmap")}
                className={`flex-1 md:flex-initial px-2 md:px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all text-center ${activeTab === "roadmap" ? "bg-white text-slate-950 shadow-lg" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
            >
                {t('Tabs.roadmap')}
            </button>
            <button
                onClick={() => setActiveTab("ideas")}
                className={`flex-1 md:flex-initial px-2 md:px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all text-center ${activeTab === "ideas" ? "bg-white text-slate-950 shadow-lg" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
            >
                {t('Tabs.ideas')}
            </button>
            <button
                onClick={() => setActiveTab("bugs")}
                className={`flex-1 md:flex-initial px-2 md:px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all text-center ${activeTab === "bugs" ? "bg-white text-slate-950 shadow-lg" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
            >
                {t('Tabs.bugs')}
            </button>
        </div>
    );
}
