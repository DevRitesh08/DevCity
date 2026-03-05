// ─── Test Data ─────────────────────────────────────────────────
// DATA-RUNNER: Hardcoded set of 20 developers with varied stats
// for Phase 1 prototype testing. Covers a range of contribution
// levels and languages for district variety.

import type { CityBuilding } from "@devcity/types";
import { computeBuildingDimensions } from "./building";

interface TestDeveloper {
    login: string;
    name: string;
    avatar_url: string;
    contributions: number;
    public_repos: number;
    total_stars: number;
    followers: number;
    district: string;
}

const TEST_DEVELOPERS: TestDeveloper[] = [
    // Downtown Core (Top devs)
    { login: "torvalds", name: "Linus Torvalds", avatar_url: "", contributions: 150000, public_repos: 8, total_stars: 180000, followers: 200000, district: "downtown-core" },
    { login: "gaearon", name: "Dan Abramov", avatar_url: "", contributions: 85000, public_repos: 250, total_stars: 120000, followers: 80000, district: "downtown-core" },
    { login: "sindresorhus", name: "Sindre Sorhus", avatar_url: "", contributions: 95000, public_repos: 1100, total_stars: 500000, followers: 55000, district: "downtown-core" },

    // Neon Alley (Frontend: TS/JS)
    { login: "developit", name: "Jason Miller", avatar_url: "", contributions: 12000, public_repos: 180, total_stars: 60000, followers: 12000, district: "neon-alley" },
    { login: "antfu", name: "Anthony Fu", avatar_url: "", contributions: 45000, public_repos: 400, total_stars: 80000, followers: 30000, district: "neon-alley" },
    { login: "tanstack_dev", name: "Tanner Linsley", avatar_url: "", contributions: 18000, public_repos: 60, total_stars: 45000, followers: 8000, district: "neon-alley" },

    // The Forge (Backend: Go/Rust/Java)
    { login: "bradfitz", name: "Brad Fitzpatrick", avatar_url: "", contributions: 20000, public_repos: 45, total_stars: 15000, followers: 7000, district: "the-forge" },
    { login: "dtolnay", name: "David Tolnay", avatar_url: "", contributions: 25000, public_repos: 90, total_stars: 50000, followers: 5000, district: "the-forge" },
    { login: "burntsushi", name: "Andrew Gallant", avatar_url: "", contributions: 8000, public_repos: 70, total_stars: 30000, followers: 4000, district: "the-forge" },

    // Neural District (Python/Data)
    { login: "jax_dev", name: "ML Researcher", avatar_url: "", contributions: 30000, public_repos: 120, total_stars: 25000, followers: 15000, district: "neural-district" },
    { login: "fast_ai", name: "FastAI Dev", avatar_url: "", contributions: 15000, public_repos: 40, total_stars: 18000, followers: 6000, district: "neural-district" },
    { login: "pandas_dev", name: "Data Engineer", avatar_url: "", contributions: 5000, public_repos: 20, total_stars: 3000, followers: 1000, district: "neural-district" },

    // Sky Deck (Mobile: Swift/Kotlin)
    { login: "mattt", name: "Mattt Thompson", avatar_url: "", contributions: 7000, public_repos: 35, total_stars: 20000, followers: 9000, district: "sky-deck" },
    { login: "kotlin_dev", name: "Kotlin Dev", avatar_url: "", contributions: 3000, public_repos: 15, total_stars: 5000, followers: 2000, district: "sky-deck" },

    // Grid Zero (DevOps)
    { login: "jessfraz", name: "Jess Frazelle", avatar_url: "", contributions: 22000, public_repos: 200, total_stars: 35000, followers: 20000, district: "grid-zero" },
    { login: "devops_eng", name: "DevOps Engineer", avatar_url: "", contributions: 4000, public_repos: 30, total_stars: 2000, followers: 800, district: "grid-zero" },

    // Small/New devs
    { login: "newbie_dev", name: "New Developer", avatar_url: "", contributions: 50, public_repos: 3, total_stars: 5, followers: 10, district: "neon-alley" },
    { login: "student_coder", name: "CS Student", avatar_url: "", contributions: 200, public_repos: 8, total_stars: 20, followers: 30, district: "neural-district" },
    { login: "indie_hacker", name: "Indie Hacker", avatar_url: "", contributions: 1500, public_repos: 12, total_stars: 800, followers: 200, district: "neon-alley" },
    { login: "startup_founder", name: "Startup Founder", avatar_url: "", contributions: 8000, public_repos: 25, total_stars: 5000, followers: 3000, district: "the-forge" },
];

/**
 * Generates a spiral city layout from test data.
 * Center = highest rank, spiraling outward by rank.
 */
function generateSpiralLayout(devs: TestDeveloper[]): [number, number][] {
    const sorted = [...devs].sort((a, b) => b.contributions - a.contributions);
    const positions: [number, number][] = [];
    const spacing = 35; // Space between buildings

    for (let i = 0; i < sorted.length; i++) {
        // Golden angle spiral for natural-looking distribution
        const angle = i * 2.399963; // Golden angle in radians
        const radius = spacing * Math.sqrt(i + 1);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        positions.push([Math.round(x), Math.round(z)]);
    }

    return positions;
}

/**
 * Generate a complete set of CityBuilding objects from test data.
 * Use this for Phase 1 prototype before real GitHub data pipeline.
 */
export function generateTestCity(): CityBuilding[] {
    const positions = generateSpiralLayout(TEST_DEVELOPERS);
    const sorted = [...TEST_DEVELOPERS].sort(
        (a, b) => b.contributions - a.contributions
    );

    return sorted.map((dev, i) => {
        const dimensions = computeBuildingDimensions({
            contributions: dev.contributions,
            publicRepos: dev.public_repos,
            totalStars: dev.total_stars,
            followers: dev.followers,
        });

        return {
            login: dev.login,
            name: dev.name,
            avatar_url: dev.avatar_url,
            rank: i + 1,
            contributions: dev.contributions,
            public_repos: dev.public_repos,
            total_stars: dev.total_stars,
            followers: dev.followers,
            kudos_count: 0,
            visit_count: 0,
            dimensions,
            position: positions[i],
            district: dev.district,
            cosmetics: [],
            highest_tier: null,
        };
    });
}
