"use strict";

const STORAGE_KEY = "prompt-card-layout-v3";
const PRIMARY_DATA_SOURCE = "./skills.md";
const FALLBACK_DATA_SOURCE = "./README.md";
const PART_ONE_HEADING = /^#\s+Part I:\s*写作 Prompt 集合\s*$/;
const PART_TWO_HEADING = /^#\s+Part II:/;
const UNGROUPED = "未分类";
const META_TEMPLATE_TEXT = `# Role
你是一位世界顶级的 AI 提示词工程师（Prompt Engineer）。你的任务是根据我的【核心需求】，为我量身定制一套高标准、结构化的提示词模板，以便我能够用它来指导其他 AI 完美执行任务。

# Task
请分析我的需求，并严格按照下方的【目标模板结构】生成一份高质量的提示词。

# Target Template Structure (目标模板结构)
你输出的提示词必须包含以下四个部分，并且排版清晰：
1. # Role (角色设定)：为执行该任务的 AI 赋予一个最匹配、最资深的专家身份（例如：资深学术翻译官、顶级期刊编辑、高级数据分析师等）。
2. # Task (核心任务)：用一两句话清晰、无歧义地概括 AI 需要完成的动作。
3. # Constraints (约束与规则)：这是最核心的部分。请根据我的需求，帮我穷举并细化 AI 在执行任务时必须遵守的规则。可以包括但不限于：
   - 工作流（第一步做什么，第二步做什么）
   - 质量标准（语气风格、专业度要求）
   - 避坑指南（明确指出“不要做什么”，比如不要擅自增加信息、不要使用特定词汇等）
   - 输出格式（JSON、Markdown、纯文本、表格等）
4. # Input (输入区)：在末尾留出用括号包裹的占位符，例如 [在此处粘贴你的文本/数据/代码]，方便我后续填入真实内容。

# Constraints for You (对你的约束)
1. 专业度：生成的约束条件（Constraints）必须直击痛点。比如如果是学术写作任务，你要自动帮我加上“学术客观语气”、“避免使用过度口语化的副词”等专业规则。
2. 零废话：只输出生成好的提示词模板本身，不要加任何诸如“好的，我为您生成”之类的寒暄废话。
3. 语言：输出的提示词模板使用中文。
4. 输出格式补充：最终输出的第一行必须是标题（仅标题，不加解释），且必须为中文短标题，严格控制在 4-5 个字；从第二行开始输出完整 skills 模板正文。

# Input (我的核心需求)
[在这里填写你的具体需求，例如：我想把一篇论文的 Introduction 喂给 AI，让它帮我写出一篇不超过300字的 Abstract，要有逻辑感，符合计算机顶会的风格。]`;
const META_INPUT_PLACEHOLDER =
  "[在这里填写你的具体需求，例如：我想把一篇论文的 Introduction 喂给 AI，让它帮我写出一篇不超过300字的 Abstract，要有逻辑感，符合计算机顶会的风格。]";

/* ── DOM refs ── */
const phasesRoot = document.getElementById("phasesRoot");
const trashRoot = document.getElementById("trashRoot");
const clearTrashBtn = document.getElementById("clearTrashBtn");
const cardTemplate = document.getElementById("cardTemplate");
const openAddBtn = document.getElementById("openAddBtn");
const resetUsageBtn = document.getElementById("resetUsageBtn");
const addModal = document.getElementById("addModal");
const addModalMask = document.getElementById("addModalMask");
const metaTemplateInput = document.getElementById("metaTemplateInput");
const metaNeedInput = document.getElementById("metaNeedInput");
const copyMetaBtn = document.getElementById("copyMetaBtn");
const metaStatusText = document.getElementById("metaStatusText");
const addPromptInput = document.getElementById("addPromptInput");
const createCardBtn = document.getElementById("createCardBtn");
const cancelAddBtn = document.getElementById("cancelAddBtn");
const addStatusText = document.getElementById("addStatusText");
const notice = document.getElementById("notice");
const noticeText = document.getElementById("noticeText");
const manualFile = document.getElementById("manualFile");
const manualLoadBtn = document.querySelector(".manual-load-btn");
const trashPanel = document.getElementById("trashPanel");

let baseItems = [];
let allItems = [];
let draggingId = null;
let openPhaseMenu = null;
const inputStore = new Map();
let state = createDefaultState();

init();
bindAddCardPanel();

async function init() {
  const markdown = await tryReadDataSource();
  if (!markdown) {
    render();
    return;
  }
  parseAndInit(markdown);
}

async function tryReadDataSource() {
  try {
    const response = await fetch(PRIMARY_DATA_SOURCE, { cache: "no-store" });
    if (!response.ok) throw new Error("无法读取 skills.md");
    const text = await response.text();
    hideNotice();
    return text;
  } catch (error) {
    try {
      const fallbackResponse = await fetch(FALLBACK_DATA_SOURCE, { cache: "no-store" });
      if (!fallbackResponse.ok) throw new Error("无法读取 fallback README.md");
      const fallbackText = await fallbackResponse.text();
      showNotice("当前未读取到 skills.md，已回退到 README.md。建议把数据迁移到 skills.md。");
      return fallbackText;
    } catch (fallbackError) {
      showNotice("浏览器没有直接读取到 skills.md。你可以点击下面按钮手动选择本地 skills.md 文件。");
      manualLoadBtn.classList.remove("hidden");
      return null;
    }
  }
}

manualFile.addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const text = await file.text();
  parseAndInit(text);
});

if (clearTrashBtn) {
  clearTrashBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearTrash();
  });
}

if (resetUsageBtn) {
  resetUsageBtn.addEventListener("click", () => {
    resetAllUsageCount();
  });
}

/* ── Parsing ── */

function parseAndInit(markdown) {
  try {
    hideNotice();
    baseItems = parsePromptItems(markdown).map((item) => ({
      ...item,
      source: "base",
    }));
    state = normalizeState(loadState());
    refreshAllItems();

    // Build initial phase order from base items if not present
    if (!state.phaseOrder || Object.keys(state.phaseOrder).length === 0) {
      state.phaseOrder = buildInitialPhaseOrder(allItems);
    }
    // Ensure all known phases have entries
    state.phaseOrder = ensurePhaseOrder(state.phaseOrder, allItems);

    state.commonIds = null; // no longer used
    saveState();
    render();

    if (allItems.length === 0) {
      showNotice("没有解析到可用模板，请检查 skills.md 的 Part I 和代码块格式。");
      manualLoadBtn.classList.remove("hidden");
    }
  } catch (error) {
    baseItems = [];
    allItems = [];
    state = createDefaultState();
    render();
    showNotice("解析 skills.md 失败，请确认文件内容完整后重试。");
    manualLoadBtn.classList.remove("hidden");
  }
}

function parsePromptItems(markdown) {
  const partOne = extractPartOne(markdown);
  const sections = splitSections(partOne);
  return sections
    .map((section) => {
      const prompt = extractFenceBlocks(section.content).join("\n\n").trim();
      return { id: section.id, title: section.title, category: section.category || UNGROUPED, prompt };
    })
    .filter((item) => item.prompt.length > 0);
}

function extractPartOne(markdown) {
  const lines = markdown.split(/\r?\n/);
  let inPartOne = false;
  const buffer = [];
  for (const line of lines) {
    if (!inPartOne) {
      if (PART_ONE_HEADING.test(line)) { inPartOne = true; buffer.push(line); }
      continue;
    }
    if (PART_TWO_HEADING.test(line)) break;
    buffer.push(line);
  }
  if (!inPartOne) throw new Error("skills.md 中未找到 Part I");
  return buffer.join("\n");
}

function splitSections(partOneText) {
  const lines = partOneText.split(/\r?\n/);
  const sections = [];
  let current = null;
  let currentCategory = UNGROUPED;
  let inFence = false;
  let fenceMarker = "";
  const usedIds = new Set();

  for (const line of lines) {
    const fenceMatch = line.match(/^(`{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (marker.length >= fenceMarker.length) {
        inFence = false;
        fenceMarker = "";
      }
      if (current) current.content.push(line);
      continue;
    }

    if (!inFence) {
      const categoryHeading = line.match(/^###\s+(.+?)\s*$/);
      if (categoryHeading) {
        currentCategory = cleanTitle(categoryHeading[1]) || UNGROUPED;
        continue;
      }
      const heading = line.match(/^##\s+(.+?)\s*$/);
      if (heading) {
        if (current) sections.push(current);
        const title = cleanTitle(heading[1]);
        current = { id: buildStableId(title, usedIds), title, category: currentCategory, content: [] };
        continue;
      }
    }
    if (current) current.content.push(line);
  }
  if (current) sections.push(current);
  return sections;
}

function extractFenceBlocks(lines) {
  const blocks = [];
  let inFence = false;
  let fenceMarker = "";
  let buffer = [];
  for (const line of lines) {
    const fenceMatch = line.match(/^(`{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
        buffer = [];
      } else if (marker.length >= fenceMarker.length) {
        inFence = false;
        const block = buffer.join("\n").trim();
        if (block) blocks.push(block);
        fenceMarker = "";
        buffer = [];
      }
      continue;
    }
    if (inFence) buffer.push(line);
  }
  return blocks;
}

function cleanTitle(title) {
  return title.replace(/[💡🎯✨📖📑🤖📝🎉🔬🚀🤝]/g, "").replace(/\s+/g, " ").trim();
}

function buildStableId(title, usedIds) {
  const base = title
    .toLowerCase()
    .replace(/[()（）]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9一-龥_-]/g, "") || "card";
  if (!usedIds.has(base)) { usedIds.add(base); return base; }
  let index = 2;
  while (usedIds.has(`${base}-${index}`)) index += 1;
  const id = `${base}-${index}`;
  usedIds.add(id);
  return id;
}

/* ── Phase order ── */

function buildInitialPhaseOrder(items) {
  const order = {};
  const seenPhases = [];
  for (const item of items) {
    const phase = item.category || UNGROUPED;
    if (!order[phase]) {
      order[phase] = [];
      seenPhases.push(phase);
    }
    order[phase].push(item.id);
  }
  return order;
}

function ensurePhaseOrder(existing, items) {
  const order = { ...existing };
  const seenIds = new Set();
  // Collect all IDs currently tracked
  for (const ids of Object.values(order)) {
    for (const id of ids) ids && seenIds.add(id);
  }
  // Group items by phase
  const byPhase = {};
  for (const item of items) {
    const phase = item.category || UNGROUPED;
    if (!byPhase[phase]) byPhase[phase] = [];
    byPhase[phase].push(item.id);
  }
  // Ensure each phase has an entry; add new cards at end
  for (const [phase, ids] of Object.entries(byPhase)) {
    if (!order[phase]) order[phase] = [];
    for (const id of ids) {
      if (!order[phase].includes(id)) order[phase].push(id);
    }
  }
  // Clean up phases that no longer have any matching items
  const allKnownIds = new Set(items.map((i) => i.id));
  for (const phase of Object.keys(order)) {
    order[phase] = order[phase].filter((id) => allKnownIds.has(id));
  }
  return order;
}

function getPhaseDisplayOrder(state, items) {
  // Returns phase names in display order
  const byCategory = new Map();
  for (const item of items) {
    const cat = item.category || UNGROUPED;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(item.id);
  }
  const phases = [...byCategory.keys()];
  // Put UNGROUPED last
  phases.sort((a, b) => {
    if (a === UNGROUPED) return 1;
    if (b === UNGROUPED) return -1;
    return 0;
  });
  return phases;
}

/* ── Rendering ── */

function render(options = {}) {
  const suppressAnimation = Boolean(options.suppressAnimation);
  if (suppressAnimation) document.body.classList.add("no-enter-anim");

  const itemMap = new Map(allItems.map((item) => [item.id, item]));
  const phases = getPhaseDisplayOrder(state, allItems);

  // Flatten all cards in phase order
  const allOrderedIds = [];
  phases.forEach((phaseName) => {
    const orderedIds = state.phaseOrder[phaseName] || [];
    const phaseItemIds = new Set(
      allItems.filter((i) => (i.category || UNGROUPED) === phaseName).map((i) => i.id)
    );
    const ids = orderedIds.filter((id) => phaseItemIds.has(id));
    for (const id of phaseItemIds) {
      if (!ids.includes(id)) ids.push(id);
    }
    allOrderedIds.push(...ids);
  });
  const items = allOrderedIds.map((id) => itemMap.get(id)).filter(Boolean);

  phasesRoot.innerHTML = "";
  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => {
    const card = createCard(item, item.category || UNGROUPED, index);
    fragment.appendChild(card);
  });
  phasesRoot.appendChild(fragment);

  renderTrash();

  if (suppressAnimation) {
    requestAnimationFrame(() => {
      document.body.classList.remove("no-enter-anim");
    });
  }
}

function renderTrash() {
  const trashItems = (state.trashedCustomCards || []).map((item) => ({ ...item, source: "trash" }));
  trashRoot.innerHTML = "";
  if (trashItems.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-tip";
    empty.textContent = "目前没有垃圾";
    trashRoot.appendChild(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  trashItems.forEach((item, index) => {
    const card = createCard(item, "trash", index);
    fragment.appendChild(card);
  });
  trashRoot.appendChild(fragment);
}

function createCard(item, zone, index) {
  const node = cardTemplate.content.firstElementChild.cloneNode(true);
  node.style.setProperty("--delay", `${Math.min(index * 40, 520)}ms`);
  node.dataset.cardId = item.id;
  node.dataset.zone = zone;

  const title = node.querySelector(".card-title");
  const subtitle = node.querySelector(".card-subtitle");
  const input = node.querySelector(".card-input");
  const copyBtn = node.querySelector(".copy-btn");
  const phaseBtn = node.querySelector(".phase-select-btn");
  const phaseMenu = node.querySelector(".phase-menu");
  const editBtn = node.querySelector(".edit-btn");
  const clearInputBtn = node.querySelector(".clear-input-btn");
  const deleteBtn = node.querySelector(".delete-btn");
  const status = node.querySelector(".copy-status");
  const preview = node.querySelector("pre");
  const previewSummary = node.querySelector(".prompt-preview summary");

  const editPanel = node.querySelector(".edit-panel");
  const editTitleInput = node.querySelector(".edit-title");
  const editPromptInput = node.querySelector(".edit-prompt");
  const saveEditBtn = node.querySelector(".save-edit-btn");
  const cancelEditBtn = node.querySelector(".cancel-edit-btn");

  title.textContent = item.title;
  subtitle.textContent = item.category || UNGROUPED;
  preview.textContent = item.prompt;
  if (previewSummary) {
    const usage = document.createElement("span");
    usage.className = "usage-count";
    usage.textContent = `使用 ${getUsageCount(item.id)} 次`;
    previewSummary.appendChild(usage);
  }
  input.value = inputStore.get(item.id) || "";

  // Drag
  if (zone !== "trash") {
    node.setAttribute("draggable", "true");
    node.classList.add("draggable");
    bindDragEvents(node, item.id, zone);
  }

  // Phase move / restore button
  if (zone !== "trash") {
    phaseBtn.textContent = "移至…";
    phaseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePhaseMenu(node, item.id);
    });
  } else {
    phaseBtn.textContent = "恢复";
    phaseBtn.classList.add("secondary");
    phaseBtn.classList.remove("phase-select-btn");
    phaseBtn.addEventListener("click", () => {
      restoreFromTrash(item.id);
    });
  }

  // Edit/delete visibility
  const isCustomCard = item.source === "custom";
  if (isCustomCard && zone !== "trash") {
    editBtn.classList.remove("hidden");
    deleteBtn.classList.remove("hidden");
  } else {
    editBtn.classList.add("hidden");
    deleteBtn.classList.add("hidden");
  }

  input.addEventListener("input", () => {
    inputStore.set(item.id, input.value);
  });

  copyBtn.addEventListener("click", async () => {
    const content = mergePromptAndInput(item.prompt, input.value);
    if (input.value.trim()) {
      incrementUsageCount(item.id, { skipRender: true });
      const usageNode = node.querySelector(".usage-count");
      if (usageNode) usageNode.textContent = `使用 ${getUsageCount(item.id)} 次`;
      // Re-render to update step numbers silently
      render({ suppressAnimation: true });
    }
    try {
      await copyToClipboard(content);
      setStatus(status, "已复制到剪贴板", "success");
    } catch (error) {
      setStatus(status, "复制失败，请手动复制", "error");
    }
  });

  editBtn.addEventListener("click", () => {
    if (node.querySelector(".inline-title-edit")) return;
    const inlineInput = document.createElement("input");
    inlineInput.type = "text";
    inlineInput.className = "inline-title-edit";
    inlineInput.value = item.title;
    inlineInput.setAttribute("aria-label", "编辑标题");
    inlineInput.style.width = "100%";
    inlineInput.style.font = "inherit";
    inlineInput.style.padding = "4px 6px";
    inlineInput.style.borderRadius = "8px";
    inlineInput.style.border = "1px solid rgba(20, 34, 58, 0.24)";

    title.classList.add("hidden");
    title.parentNode.insertBefore(inlineInput, title);
    inlineInput.focus();
    inlineInput.select();

    const finish = (commit) => {
      const newTitle = inlineInput.value.trim();
      inlineInput.remove();
      title.classList.remove("hidden");
      if (!commit) return;
      if (!newTitle) { setStatus(status, "标题不能为空", "error"); return; }
      if (newTitle === item.title) return;
      updateCard(item.id, newTitle, item.prompt);
    };

    inlineInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") { event.preventDefault(); finish(true); }
      else if (event.key === "Escape") { event.preventDefault(); finish(false); }
    });
    inlineInput.addEventListener("blur", () => finish(true));
  });

  saveEditBtn.addEventListener("click", () => { editPanel.classList.add("hidden"); });
  cancelEditBtn.addEventListener("click", () => { editPanel.classList.add("hidden"); });

  clearInputBtn.addEventListener("click", () => {
    input.value = "";
    inputStore.set(item.id, "");
    setStatus(status, "", "");
  });

  deleteBtn.addEventListener("click", () => {
    deleteCard(item.id);
  });

  return node;
}

function togglePhaseMenu(cardNode, cardId) {
  const menu = cardNode.querySelector(".phase-menu");
  if (!menu) return;

  // Close any other open menu
  if (openPhaseMenu && openPhaseMenu !== menu) {
    openPhaseMenu.classList.add("hidden");
  }

  const isOpen = !menu.classList.contains("hidden");
  if (isOpen) {
    menu.classList.add("hidden");
    openPhaseMenu = null;
    return;
  }

  // Populate menu with phases
  const phases = getPhaseDisplayOrder(state, allItems);
  // Clear existing options except the first (__ungrouped__)
  menu.querySelectorAll(".phase-option").forEach((btn) => btn.remove());

  phases.forEach((phase) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "phase-option";
    btn.type = "button";
    btn.textContent = phase;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      moveCardToPhase(cardId, phase);
      menu.classList.add("hidden");
      openPhaseMenu = null;
    });
    li.appendChild(btn);
    menu.appendChild(li);
  });

  menu.classList.remove("hidden");
  openPhaseMenu = menu;

  // Close on outside click
  const closeHandler = (e) => {
    if (!menu.contains(e.target) && e.target !== cardNode.querySelector(".phase-select-btn")) {
      menu.classList.add("hidden");
      openPhaseMenu = null;
      document.removeEventListener("click", closeHandler);
    }
  };
  setTimeout(() => document.addEventListener("click", closeHandler), 0);
}

/* ── Drag and drop ── */

function bindDragEvents(node, cardId, phaseName) {
  node.addEventListener("dragstart", (event) => {
    draggingId = cardId;
    node.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", cardId);
  });

  node.addEventListener("dragend", () => {
    draggingId = null;
    node.classList.remove("dragging");
    clearDragState();
  });

  node.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (draggingId === cardId) return;
    node.classList.add("drag-over");
  });

  node.addEventListener("dragleave", () => {
    node.classList.remove("drag-over");
  });

  node.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    node.classList.remove("drag-over");
    const sourceId = draggingId || event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === cardId) return;

    const sourcePhase = findCardPhase(sourceId);
    const targetPhase = phaseName;

    if (sourcePhase === targetPhase) {
      reorderWithinPhase(sourceId, cardId, targetPhase);
    } else {
      moveCardBetweenPhases(sourceId, cardId, sourcePhase, targetPhase);
    }
  });
}

// Flat grid drop target
phasesRoot.addEventListener("dragover", (event) => {
  event.preventDefault();
});

phasesRoot.addEventListener("drop", (event) => {
  const target = event.target;
  const cardNode = target.closest(".card");
  if (cardNode) return;
  if (!draggingId) return;
  const phase = findCardPhase(draggingId);
  moveToEndOfPhase(draggingId, phase);
});

// Trash drop target
if (trashPanel) {
  trashPanel.addEventListener("dragover", (event) => {
    event.preventDefault();
    trashPanel.classList.add("drop-target");
  });
  trashPanel.addEventListener("dragleave", () => {
    trashPanel.classList.remove("drop-target");
  });
  trashPanel.addEventListener("drop", (event) => {
    event.preventDefault();
    trashPanel.classList.remove("drop-target");
    const sourceId = draggingId;
    if (!sourceId) return;
    deleteCard(sourceId);
  });
}

function clearDragState() {
  document.querySelectorAll(".card.drag-over").forEach((n) => n.classList.remove("drag-over"));
}

function findCardPhase(cardId) {
  for (const [phase, ids] of Object.entries(state.phaseOrder)) {
    if (ids.includes(cardId)) return phase;
  }
  // Fallback: find by category
  const item = allItems.find((i) => i.id === cardId);
  return item ? (item.category || UNGROUPED) : UNGROUPED;
}

function reorderWithinPhase(sourceId, targetId, phaseName) {
  const arr = [...(state.phaseOrder[phaseName] || [])];
  const srcIdx = arr.indexOf(sourceId);
  const tgtIdx = arr.indexOf(targetId);
  if (srcIdx === -1 || tgtIdx === -1) return;
  const [moved] = arr.splice(srcIdx, 1);
  const insertIdx = srcIdx < tgtIdx ? tgtIdx - 1 : tgtIdx;
  arr.splice(insertIdx, 0, moved);
  state.phaseOrder[phaseName] = arr;
  commitState();
}

function moveToEndOfPhase(cardId, phaseName) {
  const arr = (state.phaseOrder[phaseName] || []).filter((id) => id !== cardId);
  arr.push(cardId);
  state.phaseOrder[phaseName] = arr;
  commitState();
}

function moveCardBetweenPhases(sourceId, targetId, sourcePhase, targetPhase) {
  // Remove from source
  if (state.phaseOrder[sourcePhase]) {
    state.phaseOrder[sourcePhase] = state.phaseOrder[sourcePhase].filter((id) => id !== sourceId);
  }
  // Insert before target in target phase
  const arr = [...(state.phaseOrder[targetPhase] || [])];
  const tgtIdx = arr.indexOf(targetId);
  if (tgtIdx === -1) {
    arr.push(sourceId);
  } else {
    arr.splice(tgtIdx, 0, sourceId);
  }
  state.phaseOrder[targetPhase] = arr;

  // Update card category to match target phase
  updateCardCategory(sourceId, targetPhase);
  commitState();
}

function moveCardToPhase(cardId, targetPhase) {
  const sourcePhase = findCardPhase(cardId);
  if (state.phaseOrder[sourcePhase]) {
    state.phaseOrder[sourcePhase] = state.phaseOrder[sourcePhase].filter((id) => id !== cardId);
  }
  if (!state.phaseOrder[targetPhase]) state.phaseOrder[targetPhase] = [];
  state.phaseOrder[targetPhase].push(cardId);
  updateCardCategory(cardId, targetPhase);
  commitState();
}

function updateCardCategory(cardId, newCategory) {
  const item = allItems.find((c) => c.id === cardId);
  if (!item) return;
  if (item.source === "custom") {
    state.customCards = state.customCards.map((c) =>
      c.id === cardId ? { ...c, category: newCategory } : c
    );
  } else {
    if (!state.editedCards[cardId]) {
      state.editedCards[cardId] = { title: item.title, prompt: item.prompt };
    }
    state.editedCards[cardId].category = newCategory;
  }
}

/* ── Card CRUD ── */

function addNewCard(title, prompt) {
  const id = buildCustomCardId();
  state.customCards.push({ id, title, category: UNGROUPED, prompt });
  if (!state.phaseOrder[phase]) state.phaseOrder[phase] = [];
  state.phaseOrder[phase].push(id);
  commitState();
}

function updateCard(cardId, newTitle, newPrompt) {
  const item = allItems.find((card) => card.id === cardId);
  if (!item) return;
  if (item.source === "custom") {
    state.customCards = state.customCards.map((card) =>
      card.id === cardId ? { ...card, title: newTitle, prompt: newPrompt } : card
    );
  } else {
    state.editedCards[cardId] = {
      ...(state.editedCards[cardId] || {}),
      title: newTitle,
      prompt: newPrompt,
    };
  }
  commitState();
}

function deleteCard(cardId) {
  const item = allItems.find((card) => card.id === cardId);
  if (!item) return;

  if (item.source === "custom") {
    state.trashedCustomCards = state.trashedCustomCards || [];
    if (!state.trashedCustomCards.some((card) => card.id === cardId)) {
      state.trashedCustomCards.push({
        id: item.id, title: item.title,
        category: item.category || UNGROUPED, prompt: item.prompt,
      });
    }
    state.customCards = state.customCards.filter((card) => card.id !== cardId);
  } else {
    if (!state.deletedCardIds.includes(cardId)) state.deletedCardIds.push(cardId);
  }

  // Remove from phase order
  for (const phase of Object.keys(state.phaseOrder)) {
    state.phaseOrder[phase] = state.phaseOrder[phase].filter((id) => id !== cardId);
  }

  delete state.editedCards[cardId];
  resetUsageCount(cardId);
  inputStore.delete(cardId);
  commitState();
}

function restoreFromTrash(cardId) {
  const list = state.trashedCustomCards || [];
  const item = list.find((card) => card.id === cardId);
  if (!item) return;
  state.trashedCustomCards = list.filter((card) => card.id !== cardId);
  if (!state.customCards.some((card) => card.id === cardId)) {
    state.customCards.push({
      id: item.id, title: item.title,
      category: item.category || UNGROUPED, prompt: item.prompt,
    });
  }
  const phase = item.category || UNGROUPED;
  if (!state.phaseOrder[phase]) state.phaseOrder[phase] = [];
  if (!state.phaseOrder[phase].includes(cardId)) state.phaseOrder[phase].push(cardId);
  commitState();
}

function clearTrash() {
  if (!state.trashedCustomCards || state.trashedCustomCards.length === 0) return;
  state.trashedCustomCards = [];
  commitState();
}

/* ── Usage tracking ── */

function getUsageCount(cardId) {
  const map = state.usageCountById || {};
  const value = Number(map[cardId] || 0);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

function incrementUsageCount(cardId, options) {
  if (!state.usageCountById || typeof state.usageCountById !== "object") state.usageCountById = {};
  const current = getUsageCount(cardId);
  state.usageCountById[cardId] = current + 1;
  saveState();
  if (!options || !options.skipRender) render({ suppressAnimation: true });
  return current + 1;
}

function resetUsageCount(cardId) {
  if (!state.usageCountById || typeof state.usageCountById !== "object") return;
  if (state.usageCountById[cardId]) delete state.usageCountById[cardId];
}

function resetAllUsageCount() {
  state.usageCountById = {};
  commitState();
}

/* ── State management ── */

function createDefaultState() {
  return {
    phaseOrder: {},
    customCards: [],
    trashedCustomCards: [],
    usageCountById: {},
    editedCards: {},
    deletedCardIds: [],
  };
}

function normalizeState(raw) {
  const next = createDefaultState();
  if (!raw || typeof raw !== "object") return next;

  if (raw.phaseOrder && typeof raw.phaseOrder === "object") {
    Object.keys(raw.phaseOrder).forEach((phase) => {
      if (Array.isArray(raw.phaseOrder[phase])) {
        next.phaseOrder[phase] = raw.phaseOrder[phase].filter((id) => typeof id === "string");
      }
    });
  }
  if (Array.isArray(raw.customCards)) {
    next.customCards = raw.customCards
      .filter((card) => card && typeof card === "object")
      .map((card) => ({
        id: String(card.id || "").trim(),
        title: String(card.title || "").trim(),
        category: String(card.category || "").trim() || UNGROUPED,
        prompt: String(card.prompt || "").trim(),
      }))
      .filter((card) => card.id && card.title && card.prompt);
  }
  if (Array.isArray(raw.trashedCustomCards)) {
    next.trashedCustomCards = raw.trashedCustomCards
      .filter((card) => card && typeof card === "object")
      .map((card) => ({
        id: String(card.id || "").trim(),
        title: String(card.title || "").trim(),
        category: String(card.category || "").trim() || UNGROUPED,
        prompt: String(card.prompt || "").trim(),
      }))
      .filter((card) => card.id && card.title && card.prompt);
  }
  if (raw.usageCountById && typeof raw.usageCountById === "object") {
    Object.keys(raw.usageCountById).forEach((id) => {
      const count = Number(raw.usageCountById[id]);
      if (!id || !Number.isFinite(count) || count <= 0) return;
      next.usageCountById[id] = Math.floor(count);
    });
  }
  if (raw.editedCards && typeof raw.editedCards === "object") {
    Object.keys(raw.editedCards).forEach((id) => {
      const patch = raw.editedCards[id];
      if (!patch || typeof patch !== "object") return;
      const title = String(patch.title || "").trim();
      const prompt = String(patch.prompt || "").trim();
      if (!title || !prompt) return;
      next.editedCards[id] = { title, prompt };
      if (patch.category && typeof patch.category === "string") {
        next.editedCards[id].category = patch.category.trim();
      }
    });
  }
  if (Array.isArray(raw.deletedCardIds)) {
    next.deletedCardIds = raw.deletedCardIds.filter((id) => typeof id === "string");
  }
  return next;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    return JSON.parse(raw);
  } catch (error) {
    return createDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: Date.now() }));
  } catch (error) { /* Ignore */ }
}

function commitState(options = {}) {
  refreshAllItems();
  state.phaseOrder = ensurePhaseOrder(state.phaseOrder, allItems);
  saveState();
  render(options);
}

function refreshAllItems() {
  allItems = materializeItems(baseItems, state);
}

function materializeItems(base, currentState) {
  const deleted = new Set(currentState.deletedCardIds);
  const edited = currentState.editedCards || {};
  const seen = new Set();
  const output = [];

  base.forEach((item) => {
    if (deleted.has(item.id)) return;
    const patch = edited[item.id];
    const next = {
      id: item.id,
      title: patch && typeof patch.title === "string" ? patch.title : item.title,
      category: patch && patch.category ? patch.category : (item.category || UNGROUPED),
      prompt: patch && typeof patch.prompt === "string" ? patch.prompt : item.prompt,
      source: "base",
    };
    if (!next.title || !next.prompt || seen.has(next.id)) return;
    seen.add(next.id);
    output.push(next);
  });

  currentState.customCards.forEach((item) => {
    if (!item || !item.id || !item.title || !item.prompt) return;
    if (seen.has(item.id)) return;
    seen.add(item.id);
    output.push({
      id: item.id, title: item.title,
      category: item.category || UNGROUPED, prompt: item.prompt, source: "custom",
    });
  });

  return output;
}

/* ── Add modal ── */

function bindAddCardPanel() {
  if (!openAddBtn || !addModal || !addModalMask || !metaTemplateInput || !metaNeedInput ||
      !copyMetaBtn || !metaStatusText || !addPromptInput || !createCardBtn || !cancelAddBtn || !addStatusText) {
    return;
  }

  metaTemplateInput.value = META_TEMPLATE_TEXT;

  openAddBtn.addEventListener("click", () => {
    addModal.classList.remove("hidden");
    metaNeedInput.focus();
  });

  addModalMask.addEventListener("click", () => closeAddPanel());
  cancelAddBtn.addEventListener("click", () => closeAddPanel());

  copyMetaBtn.addEventListener("click", async () => {
    const need = metaNeedInput.value.trim();
    if (!need) {
      metaStatusText.textContent = "请先填写需求";
      metaStatusText.className = "meta-status error";
      metaNeedInput.focus();
      return;
    }
    const output = META_TEMPLATE_TEXT.replace(META_INPUT_PLACEHOLDER, need);
    try {
      await copyToClipboard(output);
      metaStatusText.textContent = "已复制元模板 + 需求";
      metaStatusText.className = "meta-status success";
    } catch (error) {
      metaStatusText.textContent = "复制失败，请手动复制";
      metaStatusText.className = "meta-status error";
    }
  });

  createCardBtn.addEventListener("click", () => {
    const parsed = parseGeneratedSkill(addPromptInput.value);
    if (!parsed) {
      addStatusText.textContent = "请粘贴完整内容：第一行标题，后续为 skills 模板";
      addStatusText.className = "add-status error";
      return;
    }
    addNewCard(parsed.title, parsed.prompt);
    closeAddPanel();
  });
}

function closeAddPanel() {
  if (!addModal) return;
  addModal.classList.add("hidden");
  if (metaNeedInput) metaNeedInput.value = "";
  if (metaStatusText) { metaStatusText.textContent = ""; metaStatusText.className = "meta-status"; }
  if (addPromptInput) addPromptInput.value = "";
  if (addStatusText) { addStatusText.textContent = ""; addStatusText.className = "add-status"; }
}

function parseGeneratedSkill(rawText) {
  const lines = String(rawText || "").split(/\r?\n/).map((line) => line.trim());
  const nonEmpty = lines.filter(Boolean);
  if (nonEmpty.length < 2) return null;
  let title = nonEmpty[0].replace(/^#+\s*/, "").replace(/^标题[:：]\s*/i, "").trim();
  const prompt = nonEmpty.slice(1).join("\n").trim();
  if (!title || !prompt) return null;
  return { title, prompt };
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && addModal && !addModal.classList.contains("hidden")) {
    closeAddPanel();
  }
});

/* ── Card from trash ── */


/* ── Utilities ── */

function buildCustomCardId() {
  const existing = new Set(allItems.map((item) => item.id));
  let id = "";
  do { id = `custom-${Math.random().toString(36).slice(2, 9)}`; } while (existing.has(id));
  return id;
}

function mergePromptAndInput(promptTemplate, inputText) {
  const template = (promptTemplate || "").trim();
  const userText = (inputText || "").trim();
  if (!userText) return template;
  const placeholderRegex = /\[在此处粘贴[^\]]*\]/g;
  if (placeholderRegex.test(template)) return template.replace(placeholderRegex, userText);
  return `${template}\n\n${userText}`;
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) throw new Error("copy failed");
}

function setStatus(element, text, stateClass) {
  element.textContent = text;
  element.classList.remove("success", "error");
  if (stateClass) element.classList.add(stateClass);
}

function showNotice(text) {
  noticeText.textContent = text;
  notice.classList.remove("hidden");
}

function hideNotice() {
  notice.classList.add("hidden");
  manualLoadBtn.classList.add("hidden");
}
