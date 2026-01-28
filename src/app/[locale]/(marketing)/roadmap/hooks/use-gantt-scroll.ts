import { useLayoutEffect, useRef } from "react";

export function useGanttScroll(activeTab: string) {
    const timelineRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftOnDown = useRef(0);

    useLayoutEffect(() => {
        const el = timelineRef.current;
        if (!el) return;

        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            el.style.cursor = 'grabbing';
            el.style.userSelect = 'none';
            startX.current = e.pageX - el.offsetLeft;
            scrollLeftOnDown.current = el.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDragging.current = false;
            el.style.cursor = 'grab';
            el.style.userSelect = 'auto';
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            el.style.cursor = 'grab';
            el.style.userSelect = 'auto';
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX.current) * 2; // scroll speed multiplier
            el.scrollLeft = scrollLeftOnDown.current - walk;
        };

        const handleClick = (e: MouseEvent) => {
            if (Math.abs(scrollLeftOnDown.current - el.scrollLeft) > 5) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        el.addEventListener("mousedown", handleMouseDown);
        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseup", handleMouseUp);
        el.addEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("click", handleClick, { capture: true });

        el.style.cursor = 'grab';

        return () => {
            el.removeEventListener("mousedown", handleMouseDown);
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseup", handleMouseUp);
            el.removeEventListener("mouseleave", handleMouseLeave);
            el.removeEventListener("click", handleClick, { capture: true });
        };
    }, [activeTab]);

    return { timelineRef };
}
