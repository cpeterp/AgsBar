import {Gtk } from "astal/gtk4"
import { Variable, bind } from "astal"
import Wp from "gi://AstalWp"
import { Popover } from "astal/gtk4/widget"

export default function MicBtn() {
  const audio = Wp.get_default()
  if (audio == null) {
    return null
  }
  const mic = audio.defaultMicrophone

  const thresholds: [number, string][] = [
    [67, 'microphone-sensitivity-high-symbolic'],
    [34, 'microphone-sensitivity-medium-symbolic'],
    [0, 'microphone-sensitivity-low-symbolic']
  ];

  const mic_icon = Variable.derive(
    [bind(mic, "volume"), bind(mic, "mute")],
    (vol, is_muted) => {
      vol = vol * 100;
      let icon: string | undefined = 'microphone-hardware-disabled';
      if (is_muted) {
        icon = 'microphone-sensitivity-muted-symbolic';
      } else {
        const level_icon =  thresholds.find((threshold) => threshold[0] <= vol)?.[1];
        icon = level_icon ? level_icon : icon;
      }
      return icon;
    })

  return <menubutton
    cssClasses={["quick-access-icon"]}
    name="mic-btn"
    tooltipText={bind(mic, "volume").as(vol => `Level ${Math.floor(vol*100)}%`)}
    iconName={bind(mic_icon)}
    popover={ Popover(
      {
        autohide: true,
        hasArrow: false,
        position: Gtk.PositionType.BOTTOM
      },
      <box>
        <button
          cssClasses={["volume-popover-mute-btn"]}
          iconName={bind(mic_icon)}
          onClicked={() => {mic.set_mute(!mic.get_mute())}}
        />
        <slider
          value={bind(mic, "volume")}
          onChangeValue={( {value}) => {
            mic.set_volume(value)
          }}
          widthRequest={150}
          min={0}
          max={1}
          canFocus={false}
        />
      </box>)
    }
  />
}