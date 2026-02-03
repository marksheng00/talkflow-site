"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
    RoadmapItem,
    CommunityIdea,
    BugReport,
} from "@/types/roadmap";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

// Hooks
import { useRoadmapState } from "./hooks/use-roadmap-state";
import { useRoadmapActions } from "./hooks/use-roadmap-actions";

// Components
import { RoadmapTab } from "./components/RoadmapTab";
import { IdeasTab } from "./components/IdeasTab";
import { BugsTab } from "./components/BugsTab";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { IdeaDetailModal } from "./components/IdeaDetailModal";
import { BugDetailModal } from "./components/BugDetailModal";
import { SubmitIdeaModal } from "./components/SubmitIdeaModal";
import { SubmitBugModal } from "./components/SubmitBugModal";
import { TabSwitcher } from "./components/TabSwitcher";
import { FilterBar } from "./components/FilterBar";

interface RoadmapClientProps {
    initialTasks: RoadmapItem[];
    initialIdeas: CommunityIdea[];
    initialBugs: BugReport[];
}

export default function RoadmapClient({ initialTasks, initialIdeas, initialBugs }: RoadmapClientProps) {
    const t = useTranslations('RoadmapPage');
    const navT = useTranslations('Navigation');
    const params = useParams();
    const locale = (params?.locale as string) || 'en';

    // State Management Hook
    const {
        activeTab,
        setActiveTab,
        tasks,
        setTasks,
        ideals,
        setIdeals,
        bugs,
        setBugs,
        mounted,
        selectedCategory,
        setSelectedCategory,
        selectedPlatform,
        setSelectedPlatform,
        isSubmitModalOpen,
        setIsSubmitModalOpen,
        isBugModalOpen,
        setIsBugModalOpen,
        selectedTask,
        setSelectedTask,
        selectedIdea,
        setSelectedIdea,
        selectedBug,
        setSelectedBug,
        boostedTasks,
        setBoostedTasks,
        justBoosted,
        setJustBoosted,
        votedIdeas,
        setVotedIdeas,
        lastVotedId,
        setLastVotedId,
        submitting,
        setSubmitting,
        bugSubmitting,
        setBugSubmitting,
        filteredTasks,
        filteredIdeals,
        filteredBugs,
        form,
        setForm,
        bugForm,
        setBugForm,
    } = useRoadmapState(initialTasks, initialIdeas, initialBugs);

    // Actions Hook
    const {
        handleSubmit,
        handleBugSubmit,
        handleVote,
        handleBoost,
        handleBugVote,
    } = useRoadmapActions({
        form,
        setForm,
        bugForm,
        setBugForm,
        setSubmitting,
        setBugSubmitting,
        setIdeals,
        setBugs,
        setTasks,
        setIsSubmitModalOpen,
        setIsBugModalOpen,
        setActiveTab,
        setSelectedIdea,
        setSelectedBug,
        setSelectedTask,
        setVotedIdeas,
        setLastVotedId,
        setBoostedTasks,
        setJustBoosted,
        votedIdeas,
        boostedTasks,
        ideals,
        selectedIdea,
        selectedBug,
        selectedTask,
        tasks,
        bugs,
    });



    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: navT('home'), item: '/' },
                    { name: navT('roadmap'), item: '/roadmap' }
                ]}
            />
            <AuroraBackground className="min-h-screen pb-24 text-white overflow-x-hidden">
                {/* Hero + Content Section */}
                <section className="section-block section-hero">
                    <div className="section-shell section-stack stack-tight items-center text-center">
                        <div className="section-heading max-w-none">
                            <h1 className="max-w-none typo-hero text-foreground">
                                {t('Hero.titlePrefix')}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-indigo-400 animate-text-shimmer bg-[size:200%_auto] inline-block pb-4">
                                    {t('Hero.titleSuffix')}
                                </span>
                            </h1>
                            <p className="typo-subtitle-lg text-muted/60 max-w-5xl mx-auto">
                                {t('Hero.subtitle')}
                            </p>
                        </div>

                        <div className="flex w-full flex-col stack-tight md:flex-row md:items-center md:justify-between">
                            <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
                            <FilterBar
                                activeTab={activeTab}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                selectedPlatform={selectedPlatform}
                                setSelectedPlatform={setSelectedPlatform}
                            />
                        </div>
                    </div>

                    {/* --- CONTENT TABS --- */}
                    {activeTab === "roadmap" && (
                        <RoadmapTab
                            filteredTasks={filteredTasks}
                            setSelectedTask={setSelectedTask}
                            mounted={mounted}
                            locale={locale}
                        />
                    )}

                    {activeTab === "ideas" && (
                        <IdeasTab
                            filteredIdeals={filteredIdeals}
                            setSelectedIdea={setSelectedIdea}
                            votedIdeas={votedIdeas}
                            handleVote={handleVote}
                            setIsSubmitModalOpen={setIsSubmitModalOpen}
                            lastVotedId={lastVotedId}
                        />
                    )}

                    {activeTab === "bugs" && (
                        <BugsTab
                            filteredBugs={filteredBugs}
                            setSelectedBug={setSelectedBug}
                            votedIdeas={votedIdeas}
                            handleBugVote={handleBugVote}
                            setIsBugModalOpen={setIsBugModalOpen}
                            lastVotedId={lastVotedId}
                        />
                    )}
                </section>

                {/* MODALS */}
                <TaskDetailModal
                    mounted={mounted}
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                    handleBoost={handleBoost}
                    boostedTasks={boostedTasks}
                    justBoosted={justBoosted}
                    locale={locale}
                />

                <IdeaDetailModal
                    mounted={mounted}
                    selectedIdea={selectedIdea}
                    setSelectedIdea={setSelectedIdea}
                    handleVote={handleVote}
                    votedIdeas={votedIdeas}
                    lastVotedId={lastVotedId}
                />

                <BugDetailModal
                    mounted={mounted}
                    selectedBug={selectedBug}
                    setSelectedBug={setSelectedBug}
                    handleBugVote={handleBugVote}
                    votedIdeas={votedIdeas}
                    lastVotedId={lastVotedId}
                />

                <SubmitIdeaModal
                    mounted={mounted}
                    isOpen={isSubmitModalOpen}
                    onClose={() => setIsSubmitModalOpen(false)}
                    form={form}
                    setForm={setForm}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                />

                <SubmitBugModal
                    mounted={mounted}
                    isOpen={isBugModalOpen}
                    onClose={() => setIsBugModalOpen(false)}
                    bugForm={bugForm}
                    setBugForm={setBugForm}
                    bugSubmitting={bugSubmitting}
                    onBugSubmit={handleBugSubmit}
                />
            </AuroraBackground>
        </>
    );
}
