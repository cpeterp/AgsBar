import Gtk from "gi://Gtk?version=4.0"
import { createBinding } from "ags"
import Battery from "gi://AstalBattery"
import {BATTERY_LEVEL_CRITICAL, BATTERY_LEVEL_LOW } from "../user_config"


function update_battery_state_class(widget: Gtk.Widget, percent: GLfloat) {
  /**
   * Updates the CSS class on the widget to reflect the battery level
   */
  if (percent <= BATTERY_LEVEL_CRITICAL) {
    widget.add_css_class("battery-critical");
  }
  else if (percent <= BATTERY_LEVEL_LOW) {
    widget.add_css_class("battery-low")
  } else {
    widget.remove_css_class("battery-low");
    widget.remove_css_class("battery-critical");
  }
}

export default function BatteryBtn() {
  const battery = Battery.get_default();
  
  return <button
    cssClasses={["quick-access-icon"]}
    name="battery-btn"
    onClicked={() => {
      console.log(battery.icon_name);
      console.log(battery.battery_icon_name);
    }}
    tooltip_text={createBinding(battery, "percentage").as(pct => `${Math.round(pct * 100)}%`)}
    $={(self) => {
      update_battery_state_class(self, battery.percentage)
      let pct = createBinding(battery, "percentage")
      pct.subscribe(() => 
        update_battery_state_class(self, pct.get())
      )
    }}
    >
      <image iconName={createBinding(battery, "battery_icon_name")} />
  </button>
}