import Gtk from "gi://Gtk?version=4.0" 
import { createBinding, createComputed } from "ags"
import {jsx} from "gnim"
import Wp from "gi://AstalWp"
import Astal from "gi://Astal?version=4.0"

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

  let volume = createBinding(mic, "volume")
  let isMuted = createBinding(mic, "mute")

  const mic_icon = createComputed(
    [volume, isMuted],
    (volume, isMuted) => {
      volume = volume * 100;
      let icon: string | undefined = 'microphone-hardware-disabled';
      if (isMuted) {
        icon = 'microphone-sensitivity-muted-symbolic';
      } else {
        const level_icon =  thresholds.find((threshold) => threshold[0] <= volume)?.[1];
        icon = level_icon ? level_icon : icon;
      }
      return icon
    })

  return <menubutton
      cssClasses={["quick-access-icon"]}
      name="mic-btn"
      tooltipText={volume((vol) => `Level ${Math.floor(vol*100)}%`)}
      iconName={mic_icon}
      popover={ jsx(Gtk.Popover, 
        {
          autohide: true,
          hasArrow: false,
          position: Gtk.PositionType.BOTTOM,
          child: jsx(Gtk.Box, {
            children: [
              jsx(Gtk.Button, {
                cssClasses: ["volume-popover-mute-btn"],
                iconName: mic_icon,
                onClicked: () => {mic.set_mute(!mic.get_mute())}
              }),
              jsx(Astal.Slider, {
                value: volume,
                onChangeValue: ({value}) => {
                  mic.set_volume(value)
                },
                widthRequest: 150,
                min: 0,
                max: 1,
                canFocus: false
              })
            ]
          })
        })
      }
    />
}