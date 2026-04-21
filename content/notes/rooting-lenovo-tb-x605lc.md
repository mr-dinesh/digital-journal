---
title: "Rooting a Lenovo TB-X605LC"
date: 2026-04-21
description: "Rooting a Lenovo Tab M10 FHD to activate zRAM and fix constant memory pressure on Android 9."
tags: ["android", "root", "magisk", "adb", "linux", "notes"]
---

My Lenovo Tab M10 FHD (TB-X605LC, 2019) was sitting at `status low` on memory before any apps were open. I use it for reading on Moon+Reader. An afternoon with a Debian terminal fixed that.

{{< figure src="/images/notes/android.jpg" alt="Lenovo TB-X605LC showing Magisk installed and memory status normal" >}}

## The Problem

2GB RAM in 2026. Android 9. Google Play Services alone wants 1.2GB at baseline. The lag wasn't slow CPU — it was constant process churn as the OS killed and restarted background apps under memory pressure.

The fix was already baked into the kernel: zRAM — a compressed swap disk that lives entirely in RAM. The driver was compiled in, the block device was present, nothing was switched on. Root was the only thing between that and a usable 1GB of compressed swap.

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

`status normal` means Android is no longer in crisis mode. It's the same hardware — the OS is just no longer thrashing under memory pressure every time a background process stirs.

Boot time is still ~2 minutes. That's hardware init — the touchscreen firmware sequencing alone accounts for most of it. Not worth chasing.

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

**Tools:** Debian Linux, `android-tools-adb`, `android-tools-fastboot`, Magisk v30.7, stock firmware from firmwarefile.com.
