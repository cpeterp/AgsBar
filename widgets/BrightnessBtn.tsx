import Gtk from "gi://Gtk?version=4.0" 
import Astal from "gi://Astal?version=4.0"
import { createBinding, jsx } from "ags"
import Brightness from "../services/brightness"

export default function BrightnessBtn() {
  let brightness = Brightness.get_default()
  let screenBrightness = createBinding(brightness, "screen")
  return <menubutton
    cssClasses={["quick-access-icon"]}
    name="brightness-btn"
    tooltip_text={screenBrightness.as(val => `${(val * 100).toFixed(0)}%`)}
    popover={jsx(Gtk.Popover, {
      autohide: true,
      hasArrow: false,
      position: Gtk.PositionType.BOTTOM,
      child: jsx(Astal.Slider, {
        value: screenBrightness,
        onChangeValue: ( {value}) => {
          brightness.screen = value
        },
        widthRequest: 150,
        min: 0.01,
        max: 1,
        canFocus: false,
      })
    })}>
    <image iconName="display-brightness-symbolic" />
  </menubutton>
}