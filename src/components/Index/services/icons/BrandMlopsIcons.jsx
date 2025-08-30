import React from "react";

const base = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

export const NotebookIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 3h9a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M9 7h5M9 10h5" />
    <path d="M17 5h1a2 2 0 0 1 2 2v12" />
  </svg>
);

export const RegistryIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M7 8h10M7 12h10M7 16h6" />
  </svg>
);

export const BoxIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M3 7l9-4 9 4-9 4-9-4Z" />
    <path d="M12 11V3" />
    <path d="M21 7v7a2 2 0 0 1-1.2 1.83l-7.8 3.47a2 2 0 0 1-1.99 0L2.2 16.83A2 2 0 0 1 1 15V7" />
  </svg>
);

export const WorkflowIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="6" height="6" rx="1.5" />
    <rect x="15" y="3" width="6" height="6" rx="1.5" />
    <rect x="9" y="15" width="6" height="6" rx="1.5" />
    <path d="M9 6h6M6 9v3h6M18 9v3h-3" />
  </svg>
);

export const MonitorIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M7 20h10M12 16v4" />
    <path d="M6 10l3 3 3-3 3 3 3-3" />
  </svg>
);
