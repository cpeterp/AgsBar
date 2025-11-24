import Gtk from "gi://Gtk?version=4.0"
import { Accessor, createBinding, For } from "ags"
import Hyprland from "gi://AstalHyprland"

export default function WorkspacesSwitcher({monitor_id}: {monitor_id: number}) {
  /** Widget for switching between different Hyprland Workspaces */
  const hypr = Hyprland.get_default()
  let workspaces = createBinding(hypr, "workspaces").as(wss => wss
      .filter(ws => (ws.id > 0 && ws.monitor.id == monitor_id)) // filter out special workspaces
      .sort((a, b) => a.id - b.id)
    )

  return <box cssClasses={["workspaces"]}>
    <For each={workspaces}>
      {(ws, index: Accessor<number>) => 
        <button
          cssClasses={createBinding(hypr, "focusedWorkspace").as(fw =>
            ws === fw ? ["focused"] : [])}
          onClicked={() => ws.focus()}
          tooltipMarkup={createBinding(hypr, "clients").as((clients) => {
            return clients.filter(cl => cl.workspace?.id === ws.id)
              .map(cl => `${cl.initialTitle}: ${cl.title}`)
              .join("\n")
          })}
        >
          <box
            // Circle or w/e to use as a marker for each WS
            hexpand={false}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            homogeneous={false}
            cssClasses={["workspace-symbol"]} />
        </button>
      }
    </For>
  </box>
}