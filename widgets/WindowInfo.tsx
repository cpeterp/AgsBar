import Gtk from "gi://Gtk?version=4.0"
import { createBinding } from "ags"
import Hyprland from "gi://AstalHyprland"


export default function WindowInfo() {
  /** Widget for switching between different Hyprland Workspaces */
  const hypr = Hyprland.get_default()
  
  return <box 
    cssClasses={[]}
  >
    <label>
      {/* {bind(Variable.derive(
        [bind(hypr, "focusedClient"), bind(hypr.focusedClient, "title")],
        (client, title) => {
          return hypr.focusedClient.title;
      }))} */}
    </label>
  </box>
}