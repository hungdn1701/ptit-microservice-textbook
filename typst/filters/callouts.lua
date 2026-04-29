-- =============================================================
-- callouts.lua — Pandoc Lua filter for Typst callout conversion
--
-- Converts Markdown blockquotes with emoji prefixes into
-- Typst callout function calls.
--
-- Patterns handled:
--   > **📐 Nguyên tắc — Title**        → #principle("Title")[body]
--   > **⚠️ Sai lầm thường gặp**       → #warning("Title")[body]
--   > **⚠️ Cảnh báo**                  → #warning("Title")[body]
--   > **💡 Tip — Title**               → #tip("Title")[body]
--   > **🔍 Phân tích gap — Title**     → #analysis("Title")[body]
--   > **🔍 Phân tích — Title**         → #analysis("Title")[body]
--   > **📝 Lưu ý**                     → #note("Title")[body]
--   > **🏗️ Case Study — Title**       → #casestudy("Title")[body]
-- =============================================================

local function stringify(inlines)
  local result = {}
  for _, inline in ipairs(inlines) do
    if inline.t == "Str" then
      result[#result + 1] = inline.text
    elseif inline.t == "Space" then
      result[#result + 1] = " "
    elseif inline.t == "SoftBreak" then
      result[#result + 1] = " "
    end
  end
  return table.concat(result)
end

-- Map emoji prefix → Typst function name
local callout_map = {
  ["📐"] = "principle",
  ["⚠️"] = "warning",
  ["💡"] = "tip",
  ["🔍"] = "analysis",
  ["📝"] = "note",
  ["🏗️"] = "casestudy",
  ["🔧"] = "tip",   -- "Thực tế vs Lý thuyết" → tip
  ["📌"] = "note",
}

local function detect_callout(block_quote)
  -- A callout blockquote starts with a Strong (Bold) paragraph
  -- whose text begins with an emoji
  local blocks = block_quote.content
  if #blocks == 0 then return nil end

  local first = blocks[1]
  if first.t ~= "Para" and first.t ~= "Plain" then return nil end

  local inlines = first.content
  if #inlines == 0 then return nil end

  -- First inline should be Strong containing emoji + title
  local first_inline = inlines[1]
  if first_inline.t ~= "Strong" then return nil end

  local strong_text = stringify(first_inline.content)

  -- Try to match emoji + title pattern
  for emoji, func_name in pairs(callout_map) do
    if strong_text:sub(1, #emoji) == emoji then
      -- Extract title: everything after "EMOJI " or "EMOJI — "
      local title = strong_text:sub(#emoji + 1)
      title = title:match("^%s*[—%-]+%s*(.+)") or title:match("^%s*(.+)") or ""
      title = title:gsub("^%s+", ""):gsub("%s+$", "")

      -- Collect body content (remaining blocks after first para)
      local body_blocks = {}
      for i = 2, #blocks do
        body_blocks[#body_blocks + 1] = blocks[i]
      end

      return func_name, title, body_blocks
    end
  end

  return nil
end

function BlockQuote(elem)
  local func_name, title, body_blocks = detect_callout(elem)

  if func_name == nil then
    -- Not a callout — render as Typst quote block
    return elem
  end

  -- Build Typst raw function call
  -- We output a RawBlock in typst format
  local body_doc = pandoc.Pandoc(body_blocks)
  local body_typst = pandoc.write(body_doc, "typst")

  -- Escape title for Typst string
  title = title:gsub('"', '\\"')

  local typst_code = string.format(
    '#%s("%s")[\n%s\n]',
    func_name,
    title,
    body_typst
  )

  return pandoc.RawBlock("typst", typst_code)
end
