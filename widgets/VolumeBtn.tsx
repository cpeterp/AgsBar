import {Gtk } from "astal/gtk4"
import { Variable, bind } from "astal"
import Wp from "gi://AstalWp"
import { Popover } from "astal/gtk4/widget"

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

  const speaker_icon = Variable.derive(
    [bind(speaker, "volume"), bind(speaker, "mute")],
    (vol, is_muted) => {
      vol = vol * 100;
      let icon = null;
      if (is_muted) {
        icon = 'muted';
      } else {
        icon = thresholds.find((threshold) => threshold[0] <= vol)?.[1];
      }
      return `audio-volume-${icon}-symbolic`;
    })

  return <menubutton
    cssClasses={["quick-access-icon"]}
    name="volume-btn"
    tooltipText={bind(speaker, "volume").as(vol => `Volume ${Math.floor(vol*100)}%`)}
    iconName={bind(speaker_icon)}
    onDestroy={() => {speaker_icon.drop()}}
    popover={ Popover(
      {
        autohide: true,
        hasArrow: false,
        position: Gtk.PositionType.BOTTOM
      },
      <box>
        <button
          cssClasses={["volume-popover-mute-btn"]}
          iconName={bind(speaker_icon)}
          onClicked={() => {speaker.set_mute(!speaker.get_mute())}}
        />
        <slider
          value={bind(speaker, "volume")}
          onChangeValue={( {value}) => {
            speaker.set_volume(value)
          }}
          widthRequest={150}
          min={0}
          max={1.2}
          canFocus={false}
        />
      </box>)
    }
  />
}