import { RoadmapItem, CommunityIdea, BugReport, IdeaSubmission, BugSubmission, BugPlatform } from "@/types/roadmap";
import { accelerateRoadmapItem, voteIdea, voteBugReport, createIdea, createBugReport } from "@/lib/roadmap";
import { Tab } from "./use-roadmap-state";

// Request deduplication map
const pendingBoosts = new Map<string, Promise<RoadmapItem>>();

interface RoadmapActionsProps {
    form: { title: string; description: string; category: string };
    setForm: (form: { title: string; description: string; category: string }) => void;
    bugForm: { title: string; steps: string; expected: string; actual: string; platform: BugPlatform };
    setBugForm: (form: { title: string; steps: string; expected: string; actual: string; platform: BugPlatform }) => void;
    setSubmitting: (submitting: boolean) => void;
    setBugSubmitting: (submitting: boolean) => void;
    setIdeals: React.Dispatch<React.SetStateAction<CommunityIdea[]>>;
    setBugs: React.Dispatch<React.SetStateAction<BugReport[]>>;
    setTasks: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
    setIsSubmitModalOpen: (open: boolean) => void;
    setIsBugModalOpen: (open: boolean) => void;
    setActiveTab: (tab: Tab) => void;
    setSelectedIdea: React.Dispatch<React.SetStateAction<CommunityIdea | null>>;
    setSelectedBug: React.Dispatch<React.SetStateAction<BugReport | null>>;
    setSelectedTask: React.Dispatch<React.SetStateAction<RoadmapItem | null>>;
    setVotedIdeas: React.Dispatch<React.SetStateAction<Map<string, "up" | "down">>>;
    setLastVotedId: (id: string | null) => void;
    setBoostedTasks: React.Dispatch<React.SetStateAction<Set<string>>>;
    setJustBoosted: (just: boolean) => void;
    votedIdeas: Map<string, "up" | "down">;
    boostedTasks: Set<string>;
    ideals: CommunityIdea[];
    selectedIdea: CommunityIdea | null;
    selectedBug: BugReport | null;
    selectedTask: RoadmapItem | null;
    tasks: RoadmapItem[];
    bugs: BugReport[];
}

export function useRoadmapActions({
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
}: RoadmapActionsProps) {
    async function handleBoost(task: RoadmapItem) {
        const taskId = task.id;
        if (boostedTasks.has(taskId)) return;
        if (pendingBoosts.has(taskId)) return;

        const previousTasks = tasks;
        const prevSelectedTask = selectedTask;
        const optimisticUpdate = (t: RoadmapItem) => ({ ...t, accelerations: t.accelerations + 1 });

        setTasks(prev => prev.map(t => t.id === taskId ? optimisticUpdate(t) : t));
        if (selectedTask?.id === taskId) {
            setSelectedTask(optimisticUpdate(selectedTask));
        }
        setBoostedTasks(prev => new Set(prev).add(taskId));
        setJustBoosted(true);

        const boostPromise = (async () => {
            try {
                const updatedItem = await accelerateRoadmapItem(taskId);
                setTasks(prev => prev.map(t => t.id === taskId ? updatedItem : t));
                setSelectedTask(current => current?.id === taskId ? updatedItem : current);
                return updatedItem;
            } catch (error) {
                console.error("Boost failed", error);
                setTasks(previousTasks);
                setSelectedTask(current => current?.id === taskId ? prevSelectedTask : current);
                setBoostedTasks(prev => {
                    const next = new Set(prev);
                    next.delete(taskId);
                    return next;
                });
                throw error;
            } finally {
                pendingBoosts.delete(taskId);
            }
        })();

        pendingBoosts.set(taskId, boostPromise);
    }

    async function handleVote(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (votedIdeas.has(id)) return;

        const previousIdeals = ideals;
        const prevSelectedIdea = selectedIdea;
        const optimisticallyUpdate = (i: CommunityIdea) => {
            return { ...i, upvotes: i.upvotes + 1 };
        };

        setIdeals(prev => prev.map(i => i.id === id ? optimisticallyUpdate(i) : i));
        if (selectedIdea?.id === id) {
            setSelectedIdea(optimisticallyUpdate(selectedIdea));
        }
        setVotedIdeas(prev => new Map(prev).set(id, "up"));
        setLastVotedId(id);

        try {
            const updatedItem = await voteIdea(id, "up");
            setIdeals(prev => prev.map(i => i.id === id ? updatedItem : i));
            setSelectedIdea(current => current?.id === id ? updatedItem : current);
        } catch (error) {
            console.error("Vote failed", error);
            setIdeals(previousIdeals);
            setSelectedIdea(current => current?.id === id ? prevSelectedIdea : current);
            setVotedIdeas(prev => {
                const next = new Map(prev);
                next.delete(id);
                return next;
            });
        }
    }

    async function handleBugVote(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (votedIdeas.has(id)) return;

        const previousBugs = bugs;
        const prevSelectedBug = selectedBug;
        const optimisticUpdate = (b: BugReport) => ({ ...b, upvotes: b.upvotes + 1 });

        setBugs(prev => prev.map(b => b.id === id ? optimisticUpdate(b) : b));
        if (selectedBug?.id === id) {
            setSelectedBug(optimisticUpdate(selectedBug));
        }
        setVotedIdeas(prev => new Map(prev).set(id, "up"));
        setLastVotedId(id);

        try {
            const updatedBug = await voteBugReport(id);
            setBugs(prev => prev.map(b => b.id === id ? updatedBug : b));
            setSelectedBug(current => current?.id === id ? updatedBug : current);
        } catch (error) {
            console.error("Bug vote failed", error);
            setBugs(previousBugs);
            setSelectedBug(current => current?.id === id ? prevSelectedBug : current);
            setVotedIdeas(prev => {
                const next = new Map(prev);
                next.delete(id);
                return next;
            });
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const submission: IdeaSubmission = {
                title: form.title,
                description: form.description,
                category: form.category || undefined,
            };

            const newItem = await createIdea(submission);

            setIdeals(prev => [newItem, ...prev]);
            setIsSubmitModalOpen(false);
            setForm({ title: "", description: "", category: "" });
            setActiveTab("ideas");
        } catch (error: unknown) {
            console.error("Failed to submit idea", error);
            let message = "An error occurred. Please ensure your input is long enough.";
            
            if (error instanceof Error) {
                // Zod errors often contain JSON-like strings in their message
                if (error.message.includes('[{')) {
                    try {
                        const zodError = JSON.parse(error.message);
                        message = zodError.map((e: any) => `${e.message}`).join('\n');
                    } catch {
                        message = error.message;
                    }
                } else {
                    message = error.message;
                }
            }
            
            alert(`Failed to create idea:\n${message}`);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleBugSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBugSubmitting(true);
        try {
            const submission: BugSubmission = {
                title: bugForm.title,
                stepsToReproduce: bugForm.steps,
                expectedResult: bugForm.expected,
                actualResult: bugForm.actual,
                platform: bugForm.platform,
            };

            const newItem = await createBugReport(submission);

            setBugs(prev => [newItem, ...prev]);
            setIsBugModalOpen(false);
            setBugForm({ title: "", steps: "", expected: "", actual: "", platform: "Web" });
            setActiveTab("bugs");
        } catch (error: unknown) {
            console.error("Failed to submit bug", error);
            let message = "An error occurred. Please ensure your input is long enough.";
            
            if (error instanceof Error) {
                // Zod errors often contain JSON-like strings in their message
                if (error.message.includes('[{')) {
                    try {
                        const zodError = JSON.parse(error.message);
                        message = zodError.map((e: any) => `${e.message}`).join('\n');
                    } catch {
                        message = error.message;
                    }
                } else {
                    message = error.message;
                }
            }
            
            alert(`Failed to report bug:\n${message}`);
        } finally {
            setBugSubmitting(false);
        }
    }

    return {
        handleBoost,
        handleVote,
        handleBugVote,
        handleSubmit,
        handleBugSubmit,
    };
}
