import { Gtk } from "astal/gtk4"
import { bind, Gio } from "astal"
import Hyprland from "gi://AstalHyprland"

export default function WorkspacesSwitcher({monitor_id}: {monitor_id: number}) {
  /** Widget for switching between different Hyprland Workspaces */
  const hypr = Hyprland.get_default()

  return <box cssClasses={["workspaces"]}>
    {bind(hypr, "workspaces").as(wss => wss
      .filter(ws => (ws.id > 0 && ws.monitor.id == monitor_id)) // filter out special workspaces
      .sort((a, b) => a.id - b.id)
      .map(ws => (
        <button
          cssClasses={bind(hypr, "focusedWorkspace").as(fw =>
            ws === fw ? ["focused"] : [])}
          onClicked={() => ws.focus()}
          tooltipMarkup={bind(hypr, "clients").as((clients) => {
            return clients.filter(cl => cl.workspace?.id === ws.id)
              .map(cl => `${cl.initialTitle}: ${cl.title}`)
              .join("\n")
          })}
          // Circle or w/e to use as a marker for each WS
          child={<box
            hexpand={false}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            homogeneous={false}
            cssClasses={["workspace-symbol"]} />
          }
        />
      ))
    )}
  </box>
}