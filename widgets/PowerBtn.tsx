import Gtk from "gi://Gtk?version=4.0"
import { exec } from "ags/process"
import { jsx } from "gnim"


export default function PowerBtn() {
  const power_options = [
    ["Lock", "system-lock-screen-symbolic", "loginctl lock-session"],
    ["Reboot", "system-reboot-symbolic", "reboot"],
    ["Hibernate", "system-suspend-hibernate-symbolic", "systemctl suspend"],
    ["Shutdown", "system-shutdown-symbolic", "poweroff"]
  ]

  return <menubutton
    cssClasses={["quick-access-icon"]}
    iconName={"system-shutdown-symbolic"}
    name="power-btn"
    popover={jsx(Gtk.Popover,
      {
        autohide: true,
        hasArrow: false,
        position: Gtk.PositionType.BOTTOM,
        child: jsx(Gtk.Box, {
          name:"power-btn-menu",
          orientation:Gtk.Orientation.VERTICAL,
          children: power_options.map((option) => {
            return <button
              cssClasses={["power-btn-menu-item"]}
              onClicked={() => { exec(option[2])}}
            >
              <box>
                <image iconName={option[1]}/>
                <label>{option[0]}</label>
              </box>
            </button>
          })
        })
      })
    }
  />
} 