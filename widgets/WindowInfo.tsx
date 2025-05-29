import { Gtk } from "astal/gtk4"
import { bind, Variable } from "astal"
import Hyprland from "gi://AstalHyprland"


export default function WindowInfo() {
  /** Widget for switching between different Hyprland Workspaces */
  const hypr = Hyprland.get_default()
  
  return <box 
    cssClasses={[]}
    child={
      <label>
        {/* {bind(Variable.derive(
          [bind(hypr, "focusedClient"), bind(hypr.focusedClient, "title")],
          (client, title) => {
            return hypr.focusedClient.title;
        }))} */}
        </label>
    }
  />
}