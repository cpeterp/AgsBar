import { Gtk } from "astal/gtk4"
import {bind } from "astal"
import Brightness from "../services/brightness"
import { Popover } from "astal/gtk4/widget"


export default function BrightnessBtn() {
  const brightness = Brightness.get_default()
  return <menubutton
    cssClasses={["quick-access-icon"]}
    name="brightness-btn"
    tooltip_text={bind(brightness, "screen").as(val => `${(val * 100).toFixed(0)}%`)}
    child={<image iconName="display-brightness-symbolic" />}
    popover={ Popover(
      {
        autohide: true,
        hasArrow: false,
        position: Gtk.PositionType.BOTTOM
      },
      <slider
        value={bind(brightness, "screen")}
        onChangeValue={( {value}) => {
          brightness.screen = value
        }}
        widthRequest={150}
        min={0.01}
        max={1}
        canFocus={false}
      />)
    }
  />
}