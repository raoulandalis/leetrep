import type { OnbordaProps } from "onborda";

const stepChrome = {
  showControls: true,
  pointerPadding: 12,
  pointerRadius: 0,
} as const;

export const tours: OnbordaProps["steps"] = [
  {
    tour: "welcome",
    steps: [
      {
        icon: null,
        title: "Home",
        content:
          "This is home. When reps are due, they show up here.",
        selector: "#onborda-greeting",
        side: "bottom",
        ...stepChrome,
      },
      {
        icon: null,
        title: "Your counts",
        content:
          "Problems logged, reps completed, and your day streak.",
        selector: "#onborda-stats",
        side: "bottom",
        ...stepChrome,
      },
      {
        icon: null,
        title: "Today's Reps",
        content: "Do today's recall and re-solve work in this list.",
        selector: "#onborda-todays-reps",
        side: "top",
        ...stepChrome,
      },
      {
        icon: null,
        title: "Start the loop",
        content: "Log a solved LeetCode problem to start the loop.",
        selector: "#onborda-add-problem",
        side: "top",
        nextRoute: "/problems",
        ...stepChrome,
      },
      {
        icon: null,
        title: "Problems",
        content: "Your library. Logged problems live here.",
        selector: "#onborda-problems",
        side: "bottom",
        nextRoute: "/progress",
        prevRoute: "/dashboard",
        ...stepChrome,
      },
      {
        icon: null,
        title: "Progress",
        content: "Counts and streaks show up here as you put in reps.",
        selector: "#onborda-progress",
        side: "bottom",
        prevRoute: "/problems",
        ...stepChrome,
      },
    ],
  },
];
