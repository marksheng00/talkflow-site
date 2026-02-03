import { useTranslations } from "next-intl";
import { Tab } from "../hooks/use-roadmap-state";
import { Tabs } from "@/components/ui/Tabs";

interface TabSwitcherProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export function TabSwitcher({ activeTab, setActiveTab }: TabSwitcherProps) {
    const t = useTranslations('RoadmapPage');

    return (
        <Tabs
            variant="pills"
            className="w-full md:w-fit"
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as Tab)}
            tabs={[
                { id: "roadmap", label: t("Tabs.roadmap") },
                { id: "ideas", label: t("Tabs.ideas") },
                { id: "bugs", label: t("Tabs.bugs") },
            ]}
        />
    );
}
