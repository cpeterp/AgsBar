import { Gtk } from "astal/gtk4"
import { bind } from "astal"
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
    tooltip_text={bind(battery, "percentage").as(pct => `${Math.round(pct * 100)}%`)}
    setup={(self) => {
      update_battery_state_class(self, battery.percentage)
      bind(battery, "percentage").subscribe((pct) => {
        update_battery_state_class(self, pct)
      })
    }}
    child={<image iconName={bind(battery, "battery_icon_name")} />}
  />
}