import { Accessor, createBinding, For } from "ags"
import Tray from "gi://AstalTray"

const tray = Tray.get_default()

export default function SystemTray() {
  let items = createBinding(tray, "items")
  return <box name="sys-tray">
    <For each={items}>
      {(item, index: Accessor<number>) => {
        let ag_handler: number;
        return <menubutton
          cssClasses={["quick-access-icon"]}
          tooltipMarkup={createBinding(item, "tooltipMarkup")}
          menuModel={createBinding(item, "menuModel")}
          onDestroy={() => item.disconnect(ag_handler)}
          $={self => {
            ag_handler = item.connect("notify::action-group", () => {
              self.insert_action_group("dbusmenu", item.get_action_group())
            })
          }}
        >
          <image gicon={createBinding(item, "gicon")} />
        </menubutton>
      }}
    </For>
  </box>
}