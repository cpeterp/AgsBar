import { App, Astal, Gtk } from "astal/gtk4"
import { Variable } from "astal"
import Hyprland from "gi://AstalHyprland"

import { MAIN_MONITOR } from "../user_config"
import SystemTray from "./SystemTray"
import BrightnessBtn from "./BrightnessBtn"
import VolumeBtn from "./VolumeBtn"
import MicBtn from "./MicBtn"
import BatteryBtn from "./BatteryBtn"
import PowerBtn from "./PowerBtn"
import WorkspacesSwitcher from "./WorkspaceSwitcher"
import WindowInfo from "./WindowInfo"

// Spacer Widget
function Spacer(elem_name:string|null=null) {
  return <box 
    cssClasses={["spacer"]}
    setup={(self) => {
      if (elem_name != null) {
        self.name = elem_name
      }
    }}/>
}
// Date Widget
function Date() {
  const date_str = Variable("").poll(1000, 'date "+%a %b %d %H:%M:%S"')
  return <label 
    name="date" 
    label={date_str()}
    onDestroy={() => {date_str.drop()}} 
  />
}

// Bar sections
function LeftBar({monitor_id}: {monitor_id: number}) {
  return <box
    cssClasses={['bar-box', 'left']}
    homogeneous={false}
    vertical={false}
    hexpand
    halign={Gtk.Align.START}
    child={<WorkspacesSwitcher monitor_id = {monitor_id}/>}
  />
}

function MiddleBar() {
  return <box
    cssClasses={['bar-box', 'middle']}
    homogeneous={false}
    vertical={false}
    hexpand
    halign={Gtk.Align.CENTER}
    child={<WindowInfo/>}
  />
}

function RightBar({ monitor_id }: { monitor_id: number }) {
  return <box
    cssClasses={['bar-box', 'middle']}
    homogeneous={false}
    vertical={false}
    hexpand
    halign={Gtk.Align.END}
    children={monitor_id === MAIN_MONITOR ? [
      QuickAccessBar(),
      Spacer(),
      <Date />,
      Spacer("right-spacer"),
      <PowerBtn />
    ] : [
      <Date />
    ]}
  />
}

function QuickAccessBar() {
  return <box
    name="quick-access-bar"
    homogeneous={false}
    vertical={false}
    hexpand
    halign={Gtk.Align.END}
  >
    <SystemTray />
    <BrightnessBtn />
    <VolumeBtn />
    <MicBtn />
    <BatteryBtn />
  </box>
}

// Main bar
export default function Bar(monitor_id: number) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  const hypr = Hyprland.get_default()

  return <window
    visible
    cssClasses={["bar"]}
    monitor={monitor_id}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={TOP | LEFT | RIGHT}
    layer={Astal.Layer.TOP}
    keymode={Astal.Keymode.ON_DEMAND}
    application={App}
    setup={(self) => {
      hypr.connect('monitor-removed', (_source, id) => {
        if (self.monitor == id) {self.destroy()}
      })
    }}
    child={
      <box
        cssClasses={["main-container"]}
        hexpand
        homogeneous
        vertical={false}
        halign={Gtk.Align.FILL}
      >
        <LeftBar monitor_id={monitor_id}/>
        <MiddleBar />
        <RightBar monitor_id={monitor_id} />
      </box>
    }
  />
}