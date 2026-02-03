import React, { useState, useEffect, useMemo } from "react";
import { RoadmapItem, CommunityIdea, BugReport, Category, BugPlatform } from "@/types/roadmap";

export type Tab = "roadmap" | "ideas" | "bugs";

export function useRoadmapState(
    initialTasks: RoadmapItem[],
    initialIdeas: CommunityIdea[],
    initialBugs: BugReport[]
) {
    const [activeTab, setActiveTab] = useState<Tab>("roadmap");
    const [tasks, setTasks] = useState<RoadmapItem[]>(initialTasks);
    const [ideals, setIdeals] = useState<CommunityIdea[]>(initialIdeas);
    const [bugs, setBugs] = useState<BugReport[]>(initialBugs);
    const [mounted, setMounted] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const [selectedPlatform, setSelectedPlatform] = useState<BugPlatform | "All">("All");

    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isBugModalOpen, setIsBugModalOpen] = useState(false);

    // Selection states with private setters
    const [selectedTask, _setSelectedTask] = useState<RoadmapItem | null>(null);
    const [selectedIdea, _setSelectedIdea] = useState<CommunityIdea | null>(null);
    const [selectedBug, _setSelectedBug] = useState<BugReport | null>(null);

    const todayPercent = useMemo(() => {
        if (!mounted) return null;
        const dayMs = 1000 * 60 * 60 * 24;
        const timelineStart = Date.UTC(2024, 0, 1);
        const timelineEnd = Date.UTC(2032, 0, 31);
        const totalDays = (timelineEnd - timelineStart) / dayMs;
        const todayOffset = (Date.now() - timelineStart) / dayMs;
        return (todayOffset / totalDays) * 100;
    }, [mounted]);

    // Boost tracking
    const [boostedTasks, setBoostedTasks] = useState<Set<string>>(new Set());
    const [justBoosted, setJustBoosted] = useState(false);

    // Vote tracking
    const [votedIdeas, setVotedIdeas] = useState<Map<string, "up" | "down">>(new Map());
    const [lastVotedId, setLastVotedId] = useState<string | null>(null);

    // Form states
    const [submitting, setSubmitting] = useState(false);
    const [bugSubmitting, setBugSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
    });
    const [bugForm, setBugForm] = useState({
        title: "",
        steps: "",
        expected: "",
        actual: "",
        platform: "Web" as BugPlatform,
    });

    // Wrapped setters to clear animation flags synchronously when opening/changing modals
    const setSelectedTask: React.Dispatch<React.SetStateAction<RoadmapItem | null>> = (action) => {
        if (typeof action === 'function') {
            _setSelectedTask(action);
        } else {
            if (action) {
                setJustBoosted(false);
                setLastVotedId(null);
            }
            _setSelectedTask(action);
        }
    };

    const setSelectedIdea: React.Dispatch<React.SetStateAction<CommunityIdea | null>> = (action) => {
        if (typeof action === 'function') {
            _setSelectedIdea(action);
        } else {
            if (action) {
                setJustBoosted(false);
                setLastVotedId(null);
            }
            _setSelectedIdea(action);
        }
    };

    const setSelectedBug: React.Dispatch<React.SetStateAction<BugReport | null>> = (action) => {
        if (typeof action === 'function') {
            _setSelectedBug(action);
        } else {
            if (action) {
                setJustBoosted(false);
                setLastVotedId(null);
            }
            _setSelectedBug(action);
        }
    };

    useEffect(() => {
        if (mounted) {
            const currentHash = window.location.hash.replace('#', '');
            if (activeTab === 'roadmap' && currentHash !== '') {
                // Remove hash if it's the default tab
                window.history.replaceState(null, '', window.location.pathname);
            } else if (activeTab !== 'roadmap' && currentHash !== activeTab) {
                // Update hash for other tabs
                window.history.replaceState(null, '', `${window.location.pathname}#${activeTab}`);
            }
        }
    }, [activeTab, mounted]);

    useEffect(() => {
        setMounted(true);

        // Handle URL hash for tab switching
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'ideas' || hash === 'bugs') {
                setActiveTab(hash as Tab);
            } else {
                setActiveTab('roadmap');
            }
        };

        // Check hash on initial load
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // Filter Logic
    const filteredTasks = useMemo(() => {
        if (selectedCategory === "All") return tasks;
        return tasks.filter((t) => t.category === selectedCategory);
    }, [tasks, selectedCategory]);

    const filteredIdeals = useMemo(() => {
        if (selectedCategory === "All") return ideals;
        return ideals.filter((i) => i.category === selectedCategory);
    }, [ideals, selectedCategory]);

    const filteredBugs = useMemo(() => {
        if (selectedPlatform === "All") return bugs;
        return bugs.filter((b) => b.platform === selectedPlatform);
    }, [bugs, selectedPlatform]);

    return {
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
        todayPercent,
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
        form,
        setForm,
        bugForm,
        setBugForm,
        filteredTasks,
        filteredIdeals,
        filteredBugs,
    };
}
