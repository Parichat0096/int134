// ui/sections.js
import { declareSectionEl, changeSectionEl, cancelSectionEl } from "./elements.js";

export function showDeclareSection() { declareSectionEl.style.display = "block"; }
export function hideDeclareSection() { declareSectionEl.style.display = "none"; }

export function showChangeSection() { changeSectionEl.style.display = "block"; }
export function hideChangeSection() { changeSectionEl.style.display = "none"; }

export function showCancelSection() { cancelSectionEl.style.display = "block"; }
export function hideCancelSection() { cancelSectionEl.style.display = "none"; }
