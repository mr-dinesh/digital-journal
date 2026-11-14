---
title: "Rooting a Lenovo TB-X605LC"
date: 2026-04-21
description: "Rooting a Lenovo Tab M10 FHD to activate zRAM and fix constant memory pressure on Android 9."
tags: ["android", "root", "magisk", "adb", "linux", "notes"]
---

My Lenovo Tab M10 FHD (TB-X605LC, from 2019) was gasping for memory before I'd even opened an app. I only use it for reading books. It shouldn't be that hard. An afternoon of tinkering from my Linux computer fixed it.

*The story is up top. The exact commands, for anyone with the same tablet, are in the annexure at the end.*

{{< figure src="/images/notes/android.jpg" alt="Lenovo TB-X605LC showing Magisk installed and memory status normal" >}}

## The Problem

2GB of memory in 2026. Android 9. Google's background services alone want more than half of that. The tablet wasn't slow because of its processor. It was slow because Android kept shutting apps down to make room, then starting them up again, over and over. Like a tiny flat with too many relatives.

The fix was already inside the tablet. It has a feature called zRAM that squeezes memory to fit more in, like vacuum-packing your winter clothes. It was built in and ready, just never switched on. The only way to switch it on was to "root" the tablet, which means giving myself full control over it.

## Quick Wins Without Root

Before touching the bootloader, a few things that are fully reversible and carry no risk:

- **Cut animation speeds in half** via `adb shell`. The UI immediately feels snappier — this is the single highest-impact change on a slow device.
- **Disable Lenovo bloat** — seven pre-installed packages (OTA updater, wallpaper service, screen assistant, telemetry) that run at boot and serve no purpose on a personal device.
- **Kill location services** — five GPS daemons were running at idle. Turning off location mode dropped them all at once.

These steps together freed roughly 60MB and can be undone with a single command each.

## Rooting

The TB-X605LC is Snapdragon 450, single-partition (A-only). TWRP exists for nearby variants but not this one, so the path was Magisk on top of a stock boot image.

The bootloader unlock has a quirk on this firmware: the Developer Options toggle for OEM unlocking doesn't persist. It has to be forced via `adb shell` before rebooting into fastboot. And where most modern devices use `fastboot flashing unlock`, this one requires `fastboot oem unlock-go` — a wipe-and-unlock command that the standard unlock path explicitly tells you to use instead.

Getting a boot image without root meant pulling stock firmware (`S000100`, one minor version ahead of what was running), extracting `boot.img`, feeding it through Magisk's "Select and Patch a File" on the tablet itself, and pulling the patched image back over ADB. Flash it, reboot, done.

## zRAM

Lenovo had already configured zRAM at 1GB in the kernel. Root confirmed it was there and mounted — the OS just wasn't calling `swapon`. A small Magisk boot script fixed that permanently.

## Result

Before:
```
Total RAM: 1,880,248K  (status low)
```

After:
```
Total RAM: 1,880,248K  (status normal)
```

Same tablet, same memory, but Android is no longer in a permanent panic. The relatives have been vacuum-packed.

Boot time is still ~2 minutes. That's hardware init — the touchscreen firmware sequencing alone accounts for most of it. Not worth chasing.

---

## WiFi Recovery via EDL Reflash

One day later, of course, the WiFi switch greyed out entirely and wouldn't respond. Pride, fall, and so on. Known issue on the TB-X605LC with Android 9: the WiFi driver stack corrupts silently, often after an OTA or hard reset cycle. Bluetooth still worked, which confirmed the hardware (Qualcomm WCN3620 combo chip) was fine.

Software fixes exhausted in order: ADB wifi toggle, airplane mode cycle, wpa_supplicant restart, wiping `/data/misc/wifi/*`, network settings reset. None of them brought the toggle back.

The fix was a full stock firmware reflash via Qualcomm EDL (Emergency Download) mode — the same protocol used on the factory floor.

Since the bootloader was already unlocked and the device was rooted, entering EDL was one command:

```bash
adb reboot edl
```

The device re-enumerates as `05c6:9008` (Qualcomm QDL). From there, the `edl` Python tool handles the rest on Linux — no Windows required, no QPST/QFIL.

The firmware package from firmwarefile.com is a QDL bundle: a firehose programmer (`prog_emmc_firehose_8953_ddr.mbn`), a partition layout XML (`rawprogram_unsparse.xml`), a patch XML (`patch0.xml`), and all partition images split into chunks. The edl tool streams them to the device over USB at ~28 MB/s.

One command flashes the full eMMC:

```bash
python3 edl.py qfil rawprogram_unsparse.xml patch0.xml . --loader=prog_emmc_firehose_8953_ddr.mbn
```

Device reboots into stock Android 9. WiFi toggle immediately responsive. Magisk was gone (boot partition overwritten) but reinstalling it took ten minutes following the same path as before.

Total time from greyed-out WiFi to working: about an hour, most of it downloading the 2.4 GB firmware package.

---

## Annexure — Commands

### No-root tweaks (run inside `adb shell`)

```bash
# Animation scaling
settings put global animator_duration_scale 0.5
settings put global window_animation_scale 0.5
settings put global transition_animation_scale 0.5

# Disable Lenovo bloat
pm disable-user --user 0 com.lenovo.ocpl
pm disable-user --user 0 com.lenovo.dsa
pm disable-user --user 0 com.lenovo.ota
pm disable-user --user 0 com.tblenovo.whatsnewclient
pm disable-user --user 0 com.tblenovo.whatsnewhost
pm disable-user --user 0 com.tblenovo.wallpaper
pm disable-user --user 0 com.lenovo.screenassistant

# Kill location
settings put secure location_mode 0
```

### Bootloader unlock

```bash
adb shell settings put global oem_unlock_allowed 1
adb reboot bootloader

fastboot oem unlock-go        # wipes the device
# Note: fastboot flashing unlock fails — use oem unlock-go
```

### Patch and flash boot image

```bash
# Push stock boot.img to tablet, patch via Magisk app, pull back
adb push ~/boot.img /sdcard/boot.img
adb pull /sdcard/Download/magisk_patched-*.img ~/magisk_patched.img

# Flash
adb reboot bootloader
fastboot flash --disable-verity --disable-verification vbmeta ~/vbmeta.img
fastboot flash boot ~/magisk_patched.img
fastboot reboot

# Verify
adb shell su -c "whoami"      # root
```

### zRAM boot script

```bash
# Heredoc ! trips up bash history expansion — use a temp file
cat > /tmp/zram.sh << 'SCRIPT'
#!/system/bin/sh
swapon /dev/block/zram0
SCRIPT

adb push /tmp/zram.sh /sdcard/zram.sh
adb shell su -c "cp /sdcard/zram.sh /data/adb/post-fs-data.d/zram.sh"
adb shell su -c "chmod 755 /data/adb/post-fs-data.d/zram.sh"
```

### Verify zRAM post-root

```bash
adb shell su -c "cat /proc/swaps"
# /dev/block/zram0  partition  1048572  439788  32758

adb shell su -c "free -h"
# Swap: 1.0G  429M used  595M free
```

### EDL WiFi recovery

```bash
# Enter EDL mode (requires rooted device or hardware testpoint)
adb reboot edl

# Confirm device is in QDL mode
lsusb | grep 9008
# Bus 001 Device 009: ID 05c6:9008 Qualcomm, Inc. Gobi Wireless Modem (QDL mode)

# Clone edl tool and install dependencies
git clone https://github.com/bkerler/edl.git
cd edl
pip3 install -r requirements.txt --break-system-packages

# Install udev rules so edl can access the device without sudo
sudo cp Drivers/51-edl.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger

# Flash — run from inside the Firmware/ directory of the extracted QDL package
cd /path/to/TB-X605LC_firmware/Firmware
python3 ~/edl/edl.py qfil rawprogram_unsparse.xml patch0.xml . --loader=prog_emmc_firehose_8953_ddr.mbn

# Reset after flash completes
python3 ~/edl/edl.py reset --loader=prog_emmc_firehose_8953_ddr.mbn
```

Firmware source: firmwarefile.com — `Lenovo_Tab_M10_FHD_Rel_TB-X605LC_HW71_S000100_1912291512_Q00014_ROW_QDL.zip` (2.4 GB). This wipes userdata — back up first if possible.

### Post-reflash cleanup

After the reflash, Magisk was reinstalled (boot partition overwritten by EDL flash), then the full bloat removal pass was run again. Additional apps removed beyond the original list:

```bash
# Google
adb shell su -c "pm uninstall --user 0 com.google.android.apps.tachyon"     # Duo
adb shell su -c "pm uninstall --user 0 com.google.android.googlequicksearchbox"  # Assistant
adb shell su -c "pm uninstall --user 0 com.google.android.apps.wellbeing"   # Digital Wellbeing

# Microsoft
adb shell su -c "pm uninstall --user 0 com.microsoft.office.outlook"

# Skype
adb shell su -c "pm uninstall --user 0 com.skype.raider"

# Factory/diagnostic tools
adb shell su -c "pm uninstall --user 0 com.yha.factory"
adb shell su -c "pm uninstall --user 0 com.qualcomm.qti.qmmi"

# Logging and telemetry
adb shell su -c "pm uninstall --user 0 com.log.logservice"
adb shell su -c "pm uninstall --user 0 com.log.setlog"
adb shell su -c "pm uninstall --user 0 com.qualcomm.qti.qms.service.telemetry"

# Security hardening
adb shell settings put global send_action_app_error 0
adb shell settings put secure send_action_app_error 0
```

Apps installed via ADB: Magisk, AdAway (root hosts blocking), NewPipe, Termux. F-Droid handles the rest.

**Tools:** Debian Linux, `android-tools-adb`, `android-tools-fastboot`, Magisk v30.7, stock firmware from firmwarefile.com, `bkerler/edl` Python tool.
