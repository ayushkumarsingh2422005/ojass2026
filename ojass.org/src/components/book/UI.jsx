"use client";

import { atom, useAtom } from "jotai";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const pictures = [
    "DSC00680",
    "DSC00933",
    "DSC00966",
    "DSC00983",
    "DSC01011",
    "DSC01040",
    "DSC01064",
    "DSC01071",
];

export const pageAtom = atom(0);
export const pages = [
    {
        front: "book-cover",
        back: pictures[0],
        name: "Cover",
    },
    {
        front: pictures[1],
        back: pictures[2],
        name: "Privacy Policy",
    },
    {
        front: pictures[3],
        back: pictures[4],
        name: "Terms and Conditions",
    },
    {
        front: pictures[5],
        back: pictures[6],
        name: "Shipping Policy",
    },
    {
        front: pictures[7],
        back: "book-back",
        name: "Refund Policy",
    },
];

const toKebabCase = (str) => {
    return str
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/[\s-]+/g, " ")
        .replace(/\s+/g, "-");
};

export const UI = () => {
    const [page, setPage] = useAtom(pageAtom);
    const searchParams = useSearchParams();

    useEffect(() => {
        const pageParam = searchParams.get("page");
        if (!pageParam) return;

        const normalizedParam = toKebabCase(pageParam);

        const matchedIndex = pages.findIndex(
            (pg) => toKebabCase(pg.name) === normalizedParam,
        );

        if (matchedIndex !== -1) {
            setPage(matchedIndex);
            return;
        }

        if (normalizedParam === "back-cover") setPage(pages.length);
    }, [searchParams, setPage]);

    useEffect(() => {
        const pageName =
            page === pages.length ? "Back Cover" : pages[page]?.name || "Cover";
        const kebabName = toKebabCase(pageName);

        const url = new URL(window.location.href);
        url.searchParams.set("page", kebabName);
        window.history.replaceState(null, "", url.toString());
    }, [page]);

    useEffect(() => {
        const audio = new Audio("/book/audios/page-flip-01a.mp3");
        audio
            .play()
            .catch((e) => console.warn("Initial audio play failed:", e));
    }, [page]);

    return (
        <>
            <main className=" pointer-events-none select-none z-10 fixed inset-0 flex justify-end flex-col">
                <div className="w-full overflow-auto pointer-events-auto flex justify-center">
                    <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
                        {pages.map((pg, index) => (
                            <button
                                key={index}
                                className={`border-transparent hover:border-white transition-all duration-300 px-4 py-1 rounded-full  text-md uppercase shrink-0 border ${
                                    index === page
                                        ? "bg-white/90 text-black"
                                        : "bg-black/30 text-white"
                                }`}
                                onClick={() => setPage(index)}>
                                {pg.name}
                            </button>
                        ))}
                        <button
                            className={`border-transparent hover:border-white transition-all duration-300 px-4 py-1 rounded-full  text-md uppercase shrink-0 border ${
                                page === pages.length
                                    ? "bg-white/90 text-black"
                                    : "bg-black/30 text-white"
                            }`}
                            onClick={() => setPage(pages.length)}>
                            Back Cover
                        </button>
                    </div>
                </div>
            </main>

            <div className="fixed inset-0 flex items-center -rotate-2 select-none">
                <div className="relative bg-white/0 animate-horizontal-scroll flex items-center gap-8 w-max px-8">
                    {Array.from({ length: 12 }).map((_, idx) => (
                        <h2
                            key={idx}
                            className="shrink-0 text-white text-8xl italic font-light">
                            Ojass 2026
                        </h2>
                    ))}
                </div>
            </div>
        </>
    );
};
