import {bind } from "astal"
import Tray from "gi://AstalTray"

const tray = Tray.get_default()

export default function SystemTray() {
  return <box name="sys-tray">
    {bind(tray, "items").as((items) => {
      return items.map((item) => {
        let ag_handler: number;
        return <menubutton
          cssClasses={["quick-access-icon"]}
          tooltipMarkup={bind(item, "tooltipMarkup")}
          menuModel={bind(item, "menuModel")}
          onDestroy={() => item.disconnect(ag_handler)}
          setup={self => {
            ag_handler = item.connect("notify::action-group", () => {
              self.insert_action_group("dbusmenu", item.get_action_group())
            })
          }}
          child={
            <image gicon={bind(item, "gicon")} />
          }>
        </menubutton>
      })
    })}
  </box>
}