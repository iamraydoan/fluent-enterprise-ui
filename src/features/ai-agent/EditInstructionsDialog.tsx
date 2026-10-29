import { useRef } from "react";
import type { ReactElement } from "react";
import {
  ChevronDown16Regular,
  DocumentAdd20Regular,
  Edit20Regular,
  Highlight20Regular,
  Image20Regular,
  Link20Regular,
  LinkDismiss20Regular,
  MoreVertical20Regular,
  Table20Regular,
  TextAlignCenter20Regular,
  TextAlignJustify20Regular,
  TextAlignLeft20Regular,
  TextAlignRight20Regular,
  TextBold20Regular,
  TextBulletList20Regular,
  TextColor20Regular,
  TextIndentDecrease20Regular,
  TextIndentIncrease20Regular,
  TextItalic20Regular,
  TextNumberListLtr20Regular,
  TextStrikethrough20Regular,
  TextUnderline20Regular,
} from "@/components/icons";
import {
  Button,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
} from "@/components/ui";
import { DialogAgentSub, DialogShell } from "./DialogShell";

const useEditStyles = makeStyles({
  field: { display: "flex", columnGap: "12px", padding: "0 32px", alignItems: "flex-start" },
  label: {
    width: "110px",
    textAlign: "right",
    paddingTop: "12px",
    fontSize: "13px",
    color: "#444",
    flexShrink: 0,
  },
  editor: {
    flexGrow: 1,
    minWidth: 0,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "2px",
    backgroundColor: "#fff",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "2px",
    padding: "4px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: "#F7F7F7",
  },
  sep: {
    width: "1px",
    alignSelf: "stretch",
    backgroundColor: tokens.colorNeutralStroke2,
    margin: "2px 4px",
  },
  sel: {
    height: "32px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "4px",
    background: "#fff",
    fontFamily: "inherit",
    fontSize: "13px",
    padding: "0 6px",
    color: "#333",
  },
  area: {
    minHeight: "220px",
    maxHeight: "46vh",
    overflowY: "auto",
    padding: "8px 10px",
    fontSize: "13px",
    lineHeight: "20px",
    outline: "none",
    whiteSpace: "pre-wrap",
  },
});

const TEXT_COLORS: [string, string][] = [
  ["Black", "#000000"],
  ["Blue", "#0066A1"],
  ["Red", "#B83128"],
  ["Green", "#2E7D32"],
  ["Orange", "#E15532"],
];

interface EditInstructionsDialogProps {
  agentName: string;
  value: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

export function EditInstructionsDialog({
  agentName,
  value,
  onSave,
  onClose,
}: EditInstructionsDialogProps) {
  const editStyles = useEditStyles();
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const rememberSelection = () => {
    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };
  const execute = (command: string, argument?: string) => {
    editorRef.current?.focus();
    if (savedRangeRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRangeRef.current);
      }
    }
    document.execCommand(command, false, argument);
    rememberSelection();
  };
  const FormatButton = ({
    icon,
    label,
    command,
    argument,
    disabled,
  }: {
    icon: ReactElement;
    label: string;
    command?: string;
    argument?: string;
    disabled?: boolean;
  }) => (
    <Button
      size="small"
      appearance="subtle"
      icon={icon}
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => command && execute(command, argument)}
    />
  );
  const ColorMenu = ({
    icon,
    label,
    command,
  }: {
    icon: ReactElement;
    label: string;
    command: string;
  }) => (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          size="small"
          appearance="subtle"
          icon={icon}
          iconPosition="before"
          aria-label={label}
          onMouseDown={rememberSelection}
        >
          <ChevronDown16Regular />
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {TEXT_COLORS.map(([name, color]) => (
            <MenuItem
              key={color}
              icon={
                <span
                  style={{
                    width: 14,
                    height: 14,
                    background: color,
                    display: "inline-block",
                    border: "1px solid #ccc",
                  }}
                />
              }
              onClick={() => execute(command, color)}
            >
              {name}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
  return (
    <DialogShell
      title="Edit AI Agent Instructions"
      icon={<Edit20Regular />}
      onClose={onClose}
      sub={<DialogAgentSub agentName={agentName} />}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            appearance="primary"
            onClick={() => onSave(editorRef.current?.innerText ?? value)}
          >
            Save
          </Button>
        </>
      }
    >
      <div style={{ padding: "26px 32px 10px", fontSize: 14, color: "#333" }}>Instructions</div>
      <div className={editStyles.field}>
        <div className={editStyles.label}>
          <span style={{ color: "#C50F1F" }}>* </span>Instructions:
        </div>
        <div className={editStyles.editor}>
          <div className={editStyles.toolbar} role="toolbar" aria-label="Formatting">
            <FormatButton icon={<TextBold20Regular />} label="Bold" command="bold" />
            <FormatButton icon={<TextItalic20Regular />} label="Italic" command="italic" />
            <FormatButton icon={<TextUnderline20Regular />} label="Underline" command="underline" />
            <FormatButton
              icon={<TextStrikethrough20Regular />}
              label="Strikethrough"
              command="strikeThrough"
            />
            <span className={editStyles.sep} />
            <ColorMenu icon={<TextColor20Regular />} label="Text color" command="foreColor" />
            <ColorMenu icon={<Highlight20Regular />} label="Highlight" command="hiliteColor" />
            <span className={editStyles.sep} />
            <select
              className={editStyles.sel}
              aria-label="Font"
              defaultValue=""
              onMouseDown={rememberSelection}
              onChange={(event) => event.target.value && execute("fontName", event.target.value)}
            >
              <option value="">(inherited)</option>
              <option>Arial</option>
              <option>Segoe UI</option>
              <option>Courier New</option>
            </select>
            <select
              className={editStyles.sel}
              aria-label="Size"
              defaultValue=""
              onMouseDown={rememberSelection}
              onChange={(event) => event.target.value && execute("fontSize", event.target.value)}
            >
              <option value="">(inherited)</option>
              <option value="2">12</option>
              <option value="3">14</option>
              <option value="4">16</option>
              <option value="5">18</option>
            </select>
            <select
              className={editStyles.sel}
              aria-label="Format"
              defaultValue=""
              onMouseDown={rememberSelection}
              onChange={(event) => event.target.value && execute("formatBlock", event.target.value)}
            >
              <option value="">Format</option>
              <option value="p">Paragraph</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
            <span className={editStyles.sep} />
            <FormatButton
              icon={<TextAlignLeft20Regular />}
              label="Align left"
              command="justifyLeft"
            />
            <FormatButton
              icon={<TextAlignCenter20Regular />}
              label="Center"
              command="justifyCenter"
            />
            <FormatButton
              icon={<TextAlignRight20Regular />}
              label="Align right"
              command="justifyRight"
            />
            <FormatButton
              icon={<TextAlignJustify20Regular />}
              label="Justify"
              command="justifyFull"
            />
            <span className={editStyles.sep} />
            <FormatButton
              icon={<TextBulletList20Regular />}
              label="Bulleted list"
              command="insertUnorderedList"
            />
            <FormatButton
              icon={<TextNumberListLtr20Regular />}
              label="Numbered list"
              command="insertOrderedList"
            />
            <span className={editStyles.sep} />
            <FormatButton icon={<TextIndentIncrease20Regular />} label="Indent" command="indent" />
            <FormatButton
              icon={<TextIndentDecrease20Regular />}
              label="Outdent"
              command="outdent"
            />
            <span className={editStyles.sep} />
            <FormatButton icon={<Link20Regular />} label="Link" disabled />
            <FormatButton icon={<LinkDismiss20Regular />} label="Remove link" command="unlink" />
            <FormatButton icon={<Image20Regular />} label="Image" disabled />
            <FormatButton icon={<DocumentAdd20Regular />} label="File" disabled />
            <FormatButton icon={<Table20Regular />} label="Table" disabled />
            <span style={{ flexGrow: 1 }} />
            <FormatButton icon={<MoreVertical20Regular />} label="More" command="removeFormat" />
          </div>
          <div
            ref={(element) => {
              if (element) {
                if (!element.dataset.initialized) {
                  element.innerText = value;
                  element.dataset.initialized = "1";
                }
                editorRef.current = element;
              }
            }}
            className={editStyles.area}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="Instructions"
            onKeyUp={rememberSelection}
            onMouseUp={rememberSelection}
          />
        </div>
      </div>
    </DialogShell>
  );
}
