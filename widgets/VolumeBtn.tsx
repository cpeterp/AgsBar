import Gtk from "gi://Gtk?version=4.0"
import { createBinding, createComputed} from "ags"
import Wp from "gi://AstalWp"
import {jsx} from "gnim"
import Astal from "gi://Astal?version=4.0";

export default function VolumeBtn() {
  const audio = Wp.get_default();
  if (audio == null) {
    return null;
  }
  const speaker = audio.defaultSpeaker;

  const thresholds: [number, string][] = [
    [101, 'overamplified'],
    [67, 'high'],
    [34, 'medium'],
    [0, 'low']
  ];

  let volume = createBinding(speaker, "volume")
  let isMuted = createBinding(speaker, "mute")

  const speaker_icon = createComputed(
    [volume, isMuted],
    (volume, isMuted) => {
      volume = volume * 100;
      let icon = null;
      if (isMuted) {
        icon = 'muted';
      } else {
        icon = thresholds.find((threshold) => threshold[0] <= volume)?.[1];
      }
      return `audio-volume-${icon}-symbolic`;
    })

  return <menubutton
    cssClasses={["quick-access-icon"]}
    name="volume-btn"
    tooltipText={volume((vol) => `Volume ${Math.floor(vol*100)}%`)}
    iconName={speaker_icon}
    popover={ jsx(Gtk.Popover, 
      {
        autohide: true,
        hasArrow: false,
        position: Gtk.PositionType.BOTTOM,
        child: jsx(Gtk.Box, {
          children: [
            jsx(Gtk.Button, {
              cssClasses: ["volume-popover-mute-btn"],
              iconName: speaker_icon,
              onClicked: () => {speaker.set_mute(!speaker.get_mute())}
            }),
            jsx(Astal.Slider, {
              value: volume,
              onChangeValue: ({value}) => {
                speaker.set_volume(value)
              },
              widthRequest: 150,
              min: 0,
              max: 1.2,
              canFocus: false
            })
          ]
        })
      })
    }
  />
}