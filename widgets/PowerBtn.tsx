import { Gtk } from "astal/gtk4";
import { Popover } from "astal/gtk4/widget";
import { exec } from "astal";


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
    popover={Popover(
      {
        autohide: true,
        hasArrow: false,
        position: Gtk.PositionType.BOTTOM
      },
      <box
        name="power-btn-menu"
        vertical={true}
        children={
          power_options.map((option) => {
            return <button
              cssClasses={["power-btn-menu-item"]}
              onClicked={() => { exec(option[2])}}
              child={
              <box>
                <image iconName={option[1]}/>
                <label>{option[0]}</label>
              </box>}  
            />
          })
        }
      />)
    }
  />
} 