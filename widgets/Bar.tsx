import app from "ags/gtk4/app"
import Gtk from "gi://Gtk?version=4.0" 
import Gdk from "gi://Gdk?version=4.0"
import Astal from "gi://Astal?version=4.0"
import { createPoll } from "ags/time"
import Hyprland from "gi://AstalHyprland"
import {onCleanup} from "ags"

import { MAIN_MONITOR } from "../user_config"
import SystemTray from "./SystemTray"
import BrightnessBtn from "./BrightnessBtn"
import VolumeBtn from "./VolumeBtn"
import MicBtn from "./MicBtn"
import BatteryBtn from "./BatteryBtn"
import PowerBtn from "./PowerBtn"
import WorkspacesSwitcher from "./WorkspaceSwitcher"
import WindowInfo from "./WindowInfo"
import { jsx } from "gnim"

// Spacer Widget
function Spacer(elem_name:string|null=null) {
  return <box 
    cssClasses={["spacer"]}
    $={(self) => {
      if (elem_name != null) {
        self.name = elem_name
      }
    }}/>
}
// Date Widget
function Date() {
  let date_str = createPoll("", 1000, 'date "+%a %b %d %H:%M:%S"')
  return <label 
    name="date" 
    label={date_str}
  />
}

// Bar sections
function LeftBar({monitor_id}: {monitor_id: number}) {
  return jsx(Gtk.Box, {
    cssClasses: ['bar-box', 'left'],
    homogeneous: false,
    orientation: Gtk.Orientation.HORIZONTAL,
    hexpand: true,
    halign: Gtk.Align.START,
    children: [<WorkspacesSwitcher monitor_id = {monitor_id}/>]
  })
}

function MiddleBar() {
  return jsx(Gtk.Box, {
    cssClasses: ['bar-box', 'middle'],
    homogeneous: false,
    orientation: Gtk.Orientation.HORIZONTAL,
    hexpand: true,
    halign: Gtk.Align.CENTER,
    children: [<WindowInfo/>]
  })
}

function RightBar({ monitor_id }: { monitor_id: number }) {
  return jsx(Gtk.Box, {
    cssClasses: ['bar-box', 'right'],
    homogeneous: false,
    orientation: Gtk.Orientation.HORIZONTAL,
    hexpand: true,
    halign: Gtk.Align.END,
    children: monitor_id === MAIN_MONITOR ? [
      QuickAccessBar(),
      Spacer(),
      <Date />,
      Spacer("right-spacer"),
      <PowerBtn />
    ] : [
      <Date />
    ]
  })
}

function QuickAccessBar() {
  const children = [
    SystemTray(),
    BrightnessBtn(),
    VolumeBtn(),
    MicBtn(),
    BatteryBtn()
  ].filter(Boolean);   // removes null, undefined, false

  return <box
    name="quick-access-bar"
    homogeneous={false}
    orientation={Gtk.Orientation.HORIZONTAL}
    hexpand
    halign={Gtk.Align.END}
    children={children}
  />
}

// Main bar
export default function Bar(monitor_id: number) {
// export default function Bar(monitor: Gdk.Monitor) {
  var win: Astal.Window
  
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  const hypr = Hyprland.get_default()
  
  onCleanup(() => {
    // Root components (windows) are not automatically destroyed.
    // When the monitor is disconnected from the system, this callback
    // is run from the parent <For> which allows us to destroy the window
    win.destroy()
  })

  return <window
    visible
    cssClasses={["bar"]}
    monitor={monitor_id}
    // gdkmonitor={monitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={TOP | LEFT | RIGHT}
    layer={Astal.Layer.TOP}
    keymode={Astal.Keymode.ON_DEMAND}
    application={app}
    $={(self) => {
      (win = self)
    }}
    >
      <box
        cssClasses={["main-container"]}
        hexpand
        homogeneous
        orientation={Gtk.Orientation.HORIZONTAL}
        halign={Gtk.Align.FILL}
      >
        <LeftBar monitor_id={monitor_id}/>
        <MiddleBar />
        <RightBar monitor_id={monitor_id} />
      </box>
    </window>
}