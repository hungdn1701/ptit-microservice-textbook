/* ============================================================================
 * course-i18n.js — Course-Agnostic Declarative Localization Overlay Merger
 * ============================================================================
 * Merges a base course dataset (geometry, flows, colors, structure) with a
 * language overlay pack (text-only translations for lessons, steps, HUD, SVG).
 * Reusable across any course in the Companion Workbench ecosystem.
 * ============================================================================ */
(function (global) {
  'use strict';

  function clone(obj) {
    return obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
  }

  function applyStepOverlay(baseStep, ovStep) {
    const step = clone(baseStep);
    if (!ovStep) return step;

    if (ovStep.short !== undefined) step.short = ovStep.short;
    if (ovStep.title !== undefined) step.title = ovStep.title;
    if (Array.isArray(ovStep.body)) step.body = ovStep.body.slice();
    if (ovStep.callout !== undefined && step.callout) {
      step.callout.text = typeof ovStep.callout === 'string' ? ovStep.callout : (ovStep.callout.text ?? step.callout.text);
    }
    if (Array.isArray(ovStep.changes)) step.changes = ovStep.changes.slice();

    if (ovStep.metrics && step.metrics) {
      for (const [k, v] of Object.entries(ovStep.metrics)) {
        if (step.metrics[k]) {
          step.metrics[k].val = typeof v === 'string' ? v : (v.val ?? step.metrics[k].val);
        }
      }
    }

    if (ovStep.entities && step.scene && step.scene.entities) {
      for (const [eid, eov] of Object.entries(ovStep.entities)) {
        const ent = step.scene.entities[eid];
        if (!ent || !eov) continue;
        if (eov.label !== undefined) ent.label = clone(eov.label);
        if (eov.sub !== undefined) ent.sub = eov.sub;
        if (eov.title !== undefined) ent.title = eov.title;
        if (Array.isArray(eov.lines)) ent.lines = eov.lines.slice();
        if (Array.isArray(eov.tags) && Array.isArray(ent.tags)) {
          ent.tags = ent.tags.map((origTag, idx) => {
            const ovTag = eov.tags[idx];
            if (ovTag === undefined) return origTag;
            if (typeof origTag === 'string') return typeof ovTag === 'string' ? ovTag : ovTag.text;
            return { ...origTag, text: typeof ovTag === 'string' ? ovTag : (ovTag.text ?? origTag.text) };
          });
        }
        if (Array.isArray(eov.bars) && Array.isArray(ent.bars)) {
          ent.bars = ent.bars.map((origBar, idx) => {
            const ovBar = eov.bars[idx];
            if (!ovBar) return origBar;
            return {
              ...origBar,
              label: ovBar.label !== undefined ? ovBar.label : origBar.label,
              text: ovBar.text !== undefined ? ovBar.text : origBar.text
            };
          });
        }
      }
    }

    if (ovStep.links && step.scene && step.scene.links) {
      for (const [lid, lov] of Object.entries(ovStep.links)) {
        const lnk = step.scene.links[lid];
        if (!lnk || lov === undefined) continue;
        lnk.label = typeof lov === 'string' ? lov : (lov.label ?? lnk.label);
      }
    }

    return step;
  }

  function applyOverlay(baseCourse, overlay) {
    if (!baseCourse || !overlay) return baseCourse;
    const lessonsById = overlay.lessonsById || {};

    return {
      ...baseCourse,
      modules: Array.isArray(overlay.modules) ? overlay.modules : baseCourse.modules,
      bookSections: Array.isArray(overlay.bookSections) ? overlay.bookSections : baseCourse.bookSections,
      lessons: baseCourse.lessons.map((lesson) => {
        const ov = lessonsById[lesson.id];
        if (!ov) return { ...lesson, _localized: false };

        return {
          ...lesson,
          _localized: true,
          title: ov.title ?? lesson.title,
          summary: ov.summary ?? lesson.summary,
          level: ov.level ?? lesson.level,
          bookRef: ov.bookRef ?? lesson.bookRef,
          metrics: (lesson.metrics || []).map((m) => ({
            ...m,
            label: (ov.metrics && ov.metrics[m.id]) ? ov.metrics[m.id] : m.label
          })),
          goals: (lesson.goals || []).map((g, idx) => ({
            ...g,
            text: (Array.isArray(ov.goals) && ov.goals[idx] !== undefined) ? ov.goals[idx] : g.text
          })),
          steps: (lesson.steps || []).map((st, idx) =>
            applyStepOverlay(st, Array.isArray(ov.steps) ? ov.steps[idx] : null)
          )
        };
      })
    };
  }

  global.CourseI18n = { applyOverlay };
})(typeof window !== 'undefined' ? window : globalThis);
