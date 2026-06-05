/* ============================================================
   PROJECTS DATA - your "internal endpoint"
   ------------------------------------------------------------
   To add a new project, just append an object to the PROJECTS
   array below. A card renders automatically on the home page.

   Fields:
     title       (string)  - project title
     description (string)  - short summary shown on the card
     link        (string)  - page to open (e.g. "myproject.html")
     tags        (string[]) - small pills (tools / topics)
     media       (object):
         type = "image"  -> { type: "image", src: "images/foo.jpg" }
         type = "video"  -> { type: "video", src: "videos/foo.mov" }
   ============================================================ */

const PROJECTS = [
    {
        title: "Extended Kalman Filter on AGV Odometry Data",
        description:
            "Built an EKF from scratch in MATLAB to refine an Autonomous Ground Vehicle's odometry, then compared filtered output against true odometry.",
        link: "ekf.html",
        tags: ["MATLAB", "Sensor Fusion", "EKF"],
        media: { type: "image", src: "images/ekf1.jpg" },
    },
    {
        title: "Fuzzy Bayesian Network Risk Analysis on UAV Missions",
        description:
            "Engineered a fault-tree analysis and Bayesian network to quantify potential hazards across unmanned aerial vehicle missions.",
        link: "bayes.html",
        tags: ["MATLAB", "Bayesian Networks", "Risk Analysis"],
        media: { type: "image", src: "images/bayes_net.jpg" },
    },
    {
        title: "Ant Colony Optimization for the Travelling Salesman Problem",
        description:
            "Implemented ACO from the ground up in MATLAB, solving the TSP for varying numbers of cities and generating optimized routes.",
        link: "acs.html",
        tags: ["MATLAB", "Optimization", "ACO"],
        media: { type: "video", src: "videos/edited_ACS_TSP.mov" },
    },
    {
        title: "Path Planning using Potential Fields",
        description:
            "Designed a gradient-descent path planner using attractive and repulsive configuration-space potential fields in MATLAB.",
        link: "pps.html",
        tags: ["MATLAB", "Path Planning", "Navigation"],
        media: { type: "video", src: "videos/path_planning.mov" },
    },
    {
        title: "Path Planning for a Two-Link Manipulator",
        description:
            "Planned a two-link manipulator's trajectory with artificial potential fields and smoothed motion via cubic-polynomial waypoints.",
        link: "tlm.html",
        tags: ["MATLAB", "Manipulator", "Trajectory"],
        media: { type: "video", src: "videos/path_planning_arm.mov" },
    },

    // Append new projects here, e.g.:
    // {
    //     title: "My New Project",
    //     description: "What it does in one or two sentences.",
    //     link: "newproject.html",
    //     tags: ["ROS", "Python"],
    //     media: { type: "image", src: "images/new.jpg" },
    // },
];
